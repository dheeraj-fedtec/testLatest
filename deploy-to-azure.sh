#!/bin/bash

# Azure Deployment Script for testlatest
# This script creates all necessary Azure resources and deploys the application

set -e

# Configuration - Update these values for your deployment
RESOURCE_GROUP="FTC-GGB-DEV"
LOCATION="eastus"

# Azure Container Registry & Key Vault
ACR_NAME="acrftcggbdev"             # change if you prefer a different ACR name
KEY_VAULT_NAME="kv-apis-ftcggbdev" # change if you already created one

# Database configuration
USE_EXISTING_DB=true                # set to "false" only if you want the script to create a new Flexible Server
EXISTING_DB_FQDN="c-ftc-ggb-dev.ffwb6hfvooklec.postgres.cosmos.azure.com"
DB_NAME="citus"
DB_USERNAME="citus"
DB_PASSWORD="WEtN4nI39rzeyM75"

CONTAINER_APP_ENV="env-ftc-ggb-dev"
BACKEND_APP_NAME="testlatest-backend"
FRONTEND_APP_NAME="testlatest-frontend"

# Subscription containing the resource-group above
SUBSCRIPTION="FTC-GGB-Subscription"  # update if your subscription has a different display name

echo "🚀 Starting Azure deployment for testlatest..."

# Login to Azure (if not already logged in)
echo "📝 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please login to Azure:"
    az login
fi

# Set the correct subscription
echo "🔧 Setting Azure subscription..."
az account set --subscription "$SUBSCRIPTION" || {
    echo "❌ Failed to set subscription. Available subscriptions:"
    az account list --query "[].{Name:name, SubscriptionId:id}" --output table
    exit 1
}

# Create Resource Group
echo "📦 Creating resource group..."
az group create \
    --name $RESOURCE_GROUP \
    --location "$LOCATION"

# Create Azure Container Registry
echo "🐳 Creating Azure Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query loginServer --output tsv)

# Register required providers (Container Apps & Log Analytics)
echo "🛠️  Registering required resource providers..."
az provider register -n Microsoft.App --wait
az provider register -n Microsoft.OperationalInsights --wait

# Create or reuse Key Vault
echo "🔐 Creating or reusing Key Vault..."
az keyvault create \
    --name $KEY_VAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --enable-soft-delete \
    --retention-days 7 2>/dev/null || echo "Key Vault may already exist"

# Create a Log Analytics workspace needed for Container Apps environment
LOG_WORKSPACE="log-$RESOURCE_GROUP"
echo "📊 Creating or reusing Log Analytics workspace $LOG_WORKSPACE..."
az monitor log-analytics workspace create \
    --resource-group $RESOURCE_GROUP \
    --workspace-name $LOG_WORKSPACE \
    --location "$LOCATION" 2>/dev/null || echo "Workspace may already exist"

WORKSPACE_ID=$(az monitor log-analytics workspace show --resource-group $RESOURCE_GROUP --workspace-name $LOG_WORKSPACE --query customerId --output tsv)
WORKSPACE_KEY=$(az monitor log-analytics workspace get-shared-keys --resource-group $RESOURCE_GROUP --workspace-name $LOG_WORKSPACE --query primarySharedKey --output tsv)

# Database handling ---------------------------------------------------------
if [ "$USE_EXISTING_DB" = "false" ]; then
    echo "🗄️ Creating PostgreSQL Flexible Server..."
    DB_PASSWORD=$(openssl rand -base64 32)

    # Store database password in Key Vault
    echo "🔐 Storing database password in Key Vault..."
    az keyvault secret set \
        --vault-name $KEY_VAULT_NAME \
        --name "database-password" \
        --value "$DB_PASSWORD"

    DB_SERVER_NAME="${ACR_NAME}-pg"

    az postgres flexible-server create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --location "$LOCATION" \
        --admin-user $DB_USERNAME \
        --admin-password "$DB_PASSWORD" \
        --sku-name Standard_B1ms \
        --tier Burstable \
        --storage-size 32 \
        --version 15

    # Create database
    az postgres flexible-server db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $DB_SERVER_NAME \
        --database-name $DB_NAME

    # Configure firewall to allow Azure services
    az postgres flexible-server firewall-rule create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --rule-name AllowAzureServices \
        --start-ip-address 0.0.0.0 \
        --end-ip-address 0.0.0.0
else
    echo "ℹ️ Using existing database: $EXISTING_DB_FQDN"
    # Store existing password in Key Vault (overwrites if exists)
    az keyvault secret set \
        --vault-name $KEY_VAULT_NAME \
        --name "database-password" \
        --value "$DB_PASSWORD" || true
fi

# Create Container Apps Environment
echo "🌐 Creating Container Apps environment..."
az containerapp env create \
    --name $CONTAINER_APP_ENV \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --logs-workspace-id $WORKSPACE_ID \
    --logs-workspace-key $WORKSPACE_KEY

# Build and push Docker images
echo "🔨 Building and pushing Docker images..."

# Login to ACR
az acr login --name $ACR_NAME

# Build and push backend
echo "Building backend image..."
cd backend
docker build --platform linux/amd64 -t $ACR_LOGIN_SERVER/testlatest-backend:latest .
docker push $ACR_LOGIN_SERVER/testlatest-backend:latest
cd ..

# Build and push frontend
echo "Building frontend image..."
cd frontend
docker build --platform linux/amd64 -t $ACR_LOGIN_SERVER/testlatest-frontend:latest .
docker push $ACR_LOGIN_SERVER/testlatest-frontend:latest
cd ..

# Deploy Backend Container App
echo "🚀 Deploying backend container app..."
if [ "$USE_EXISTING_DB" = "true" ]; then
    DATABASE_URL="jdbc:postgresql://$EXISTING_DB_FQDN:5432/$DB_NAME?sslmode=require"
else
    DATABASE_URL="jdbc:postgresql://$DB_SERVER_NAME.postgres.database.azure.com:5432/$DB_NAME"
fi

az containerapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_APP_ENV \
    --image $ACR_LOGIN_SERVER/testlatest-backend:latest \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_NAME \
    --registry-password $(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv) \
    --target-port 8080 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 3 \
    --cpu 0.5 \
    --memory 1Gi \
    --env-vars \
        SPRING_PROFILES_ACTIVE=azure \
        SPRING_DATASOURCE_URL="$DATABASE_URL" \
        SPRING_DATASOURCE_USERNAME=$DB_USERNAME \
        SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"

# Get backend URL
BACKEND_URL=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)

# Deploy Frontend Container App
echo "🎨 Deploying frontend container app..."
az containerapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_APP_ENV \
    --image $ACR_LOGIN_SERVER/testlatest-frontend:latest \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_NAME \
    --registry-password $(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv) \
    --target-port 5173 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 3 \
    --cpu 0.25 \
    --memory 0.5Gi \
    --env-vars \
        BACKEND_API_URL="https://$BACKEND_URL"

# Get frontend URL
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "Resource Group: $RESOURCE_GROUP"
echo "Container Registry: $ACR_LOGIN_SERVER"
if [ "$USE_EXISTING_DB" = "false" ]; then
    echo "Database Server: $DB_SERVER_NAME.postgres.database.azure.com"
fi
echo "Backend URL: https://$BACKEND_URL"
echo "Frontend URL: https://$FRONTEND_URL"
echo ""
if [ "$USE_EXISTING_DB" = "false" ]; then
    echo "🔐 Database Credentials:"
    echo "Username: $DB_USERNAME"
    echo "Password: $DB_PASSWORD"
    echo ""
    echo "⚠️  Please save the database password securely!"
fi
echo "🌐 Your application is now live at: https://$FRONTEND_URL" 