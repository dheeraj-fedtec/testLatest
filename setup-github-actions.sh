#!/bin/bash

# GitHub Actions Setup Helper Script for testlatest
# This script helps gather all the information needed for GitHub Actions secrets

set -e

echo "🔧 GitHub Actions Setup Helper for testlatest"
echo "=================================================="
echo ""
echo "This script will help you gather the information needed to set up"
echo "GitHub Actions secrets for automatic deployment to Azure."
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "🔐 Please login to Azure first:"
    az login
fi

echo "✅ Azure CLI is ready"
echo ""

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
echo "📋 Subscription ID: $SUBSCRIPTION_ID"
echo ""

# Configuration - Updated to match deploy-to-azure.sh
RESOURCE_GROUP="FTC-GGB-DEV"
SUBSCRIPTION="FTC-GGB-Subscription"
ACR_NAME="acrftcggbdev"
KEY_VAULT_NAME="kv-apis-ftcggbdev"
DB_NAME="citus"
DB_USERNAME="citus"
EXISTING_DB_FQDN="c-ftc-ggb-dev.ffwb6hfvooklec.postgres.cosmos.azure.com"

# Set the correct subscription
echo "🔧 Setting Azure subscription..."
az account set --subscription "$SUBSCRIPTION" || {
    echo "❌ Failed to set subscription. Available subscriptions:"
    az account list --query "[].{Name:name, SubscriptionId:id}" --output table
    exit 1
}

if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo "❌ Resource group '$RESOURCE_GROUP' not found."
    echo "   Please run './deploy-to-azure.sh' first to create Azure infrastructure."
    exit 1
fi

echo "✅ Resource group '$RESOURCE_GROUP' found"
echo ""

# Get ACR credentials
echo "🐳 Getting Azure Container Registry credentials..."

if ! az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "❌ Container registry '$ACR_NAME' not found."
    echo "   Please run './deploy-to-azure.sh' first to create Azure infrastructure."
    exit 1
fi

ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

echo "✅ Container registry credentials retrieved"
echo ""

# Get database details
echo "🗄️ Getting database connection details..."
DATABASE_URL="jdbc:postgresql://$EXISTING_DB_FQDN:5432/$DB_NAME?sslmode=require"

echo "✅ Database details configured"
echo ""

# Create service principal
echo "🔑 Creating service principal for GitHub Actions..."
echo "   This will give GitHub Actions permission to deploy to your Azure resources."
echo ""

PRINCIPAL_NAME="testlatest-github-actions-$(date +%s)"
AZURE_CREDENTIALS=$(az ad sp create-for-rbac \
  --name "$PRINCIPAL_NAME" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth)

echo "✅ Service principal created: $PRINCIPAL_NAME"
echo ""

# Display all the secrets
echo "🎯 GitHub Secrets Configuration"
echo "================================"
echo ""
echo "Copy these values to your GitHub repository secrets:"
echo "Go to: Settings > Secrets and variables > Actions"
echo ""

echo "1. AZURE_CREDENTIALS:"
echo "   $AZURE_CREDENTIALS"
echo ""

echo "2. ACR_USERNAME:"
echo "   $ACR_USERNAME"
echo ""

echo "3. ACR_PASSWORD:"
echo "   $ACR_PASSWORD"
echo ""

echo "4. DATABASE_URL:"
echo "   $DATABASE_URL"
echo ""

echo "5. DATABASE_USERNAME:"
echo "   $DB_USERNAME"
echo ""

echo "6. DATABASE_PASSWORD:"
echo "   (Retrieving from Key Vault...)"
DB_PASSWORD=$(az keyvault secret show --vault-name $KEY_VAULT_NAME --name "database-password" --query value --output tsv 2>/dev/null || echo "NOT_FOUND")
if [ "$DB_PASSWORD" != "NOT_FOUND" ]; then
    echo "   $DB_PASSWORD"
else
    echo "   WEtN4nI39rzeyM75"
    echo "   (Using password from deploy script - verify this is correct)"
fi
echo ""

# Save to file for reference
SECRETS_FILE="github-secrets.txt"
cat > $SECRETS_FILE << EOF
GitHub Actions Secrets for testlatest
Generated on: $(date)

AZURE_CREDENTIALS:
$AZURE_CREDENTIALS

ACR_USERNAME:
$ACR_USERNAME

ACR_PASSWORD:
$ACR_PASSWORD

DATABASE_URL:
$DATABASE_URL

DATABASE_USERNAME:
$DB_USERNAME

DATABASE_PASSWORD:
$DB_PASSWORD

Service Principal Name: $PRINCIPAL_NAME
Subscription ID: $SUBSCRIPTION_ID
Resource Group: $RESOURCE_GROUP
ACR Name: $ACR_NAME
Key Vault Name: $KEY_VAULT_NAME
EOF

echo "💾 Secrets saved to: $SECRETS_FILE"
echo ""

echo "🚀 Next Steps:"
echo "1. Add all the above secrets to your GitHub repository"
echo "2. Push your code to the main branch"
echo "3. Watch the GitHub Actions workflow deploy your app automatically!"
echo ""
echo "📖 For detailed instructions, see: AZURE_DEPLOYMENT_GUIDE.md"
echo ""
echo "⚠️  Important: Keep the $SECRETS_FILE file secure and delete it after setup!" 