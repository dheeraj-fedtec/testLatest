# Azure Deployment Guide for testlatest

This guide will help you deploy your testlatest application to Microsoft Azure using Azure Container Apps.

## Prerequisites

Before deploying to Azure, ensure you have:

1. **Azure Account**: Active Azure subscription
2. **Azure CLI**: Installed and configured
3. **Docker**: Installed and running
4. **Git**: For version control and GitHub integration

### Install Azure CLI

**macOS:**
```bash
brew install azure-cli
```

**Windows:**
```bash
winget install Microsoft.AzureCLI
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Install Docker

Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

## Current Deployment Configuration

The application is configured to deploy to:

- **Resource Group**: `rg-testlatest`
- **Location**: `eastus`
- **Container Registry**: `acrtestlatest.azurecr.io`
- **Container Apps Environment**: `env-testlatest`

## 🔧 Configuration Customization

**IMPORTANT**: Before deploying, you'll likely need to customize the configuration for your specific Azure environment. Here's what you need to check and potentially modify:

### 1. Azure Subscription and Resource Group

**File to edit**: `deploy-to-azure.sh`

```bash
# Update these values at the top of deploy-to-azure.sh:
RESOURCE_GROUP="rg-testlatest"          # Change to your preferred resource group name
LOCATION="eastus"                      # Change to your preferred Azure region
SUBSCRIPTION="Your-Azure-Subscription"      # Replace with your actual subscription ID or name
```

**Common Azure regions**:
- `eastus` (US East)
- `westus2` (US West 2)
- `centralus` (US Central)
- `westeurope` (West Europe)
- `eastasia` (East Asia)

### 2. Resource Naming

**Files to edit**: `deploy-to-azure.sh`, `setup-github-actions.sh`

```bash
# Update these resource names if needed:
ACR_NAME="acrtestlatest"                      # Must be globally unique (3-50 chars, alphanumeric)
KEY_VAULT_NAME="kv-testlatest"          # Must be globally unique (3-24 chars, alphanumeric + hyphens)
CONTAINER_APP_ENV="env-testlatest"    # Environment name for your container apps
BACKEND_APP_NAME="testlatest-backend"      # Backend container app name
FRONTEND_APP_NAME="testlatest-frontend"    # Frontend container app name
```

**⚠️ Important naming rules**:
- **Container Registry**: 3-50 characters, alphanumeric only, globally unique
- **Key Vault**: 3-24 characters, alphanumeric and hyphens, globally unique
- **Resource Group**: 1-90 characters, alphanumeric, periods, underscores, hyphens, and parentheses

### 3. Database Configuration

**File to edit**: `deploy-to-azure.sh`

#### Option A: Create New Database (Default)
```bash
USE_EXISTING_DB=false
DB_NAME="{{DB_NAME}}"                        # Database name
DB_USERNAME="postgres"                # Database username
# Password will be auto-generated and stored in Key Vault
```

#### Option B: Use Existing Database
```bash
USE_EXISTING_DB=true
EXISTING_DB_FQDN="your-existing-db.postgres.database.azure.com"  # Your existing DB FQDN
DB_NAME="your_existing_database"             # Existing database name
DB_USERNAME="your_db_user"                   # Existing database username
DB_PASSWORD="your_db_password"               # Existing database password
```

### 4. Application Ports

**Files to edit**: `deploy-to-azure.sh`, `azure-deploy.yml`, Dockerfiles

If your application uses different ports than the defaults:

```bash
# In deploy-to-azure.sh and other files, update:
BACKEND_PORT=8080                # Default: 8080 for Spring Boot
FRONTEND_PORT=5173              # Default: 3000 for React
```

### 5. GitHub Actions Configuration

**File to edit**: `setup-github-actions.sh`

Update the subscription and resource information:

```bash
RESOURCE_GROUP="rg-testlatest"          # Must match deploy-to-azure.sh
SUBSCRIPTION="Your-Azure-Subscription"      # Must match deploy-to-azure.sh
```

### 6. Environment-Specific Settings

**File to edit**: `backend/src/main/resources/application-azure.properties`

```properties
# Update these if using custom database or Key Vault names:
azure.keyvault.uri=https://kv-testlatest.vault.azure.net/
cors.allowed-origins=${FRONTEND_URL:http://localhost:5173}
```

### 7. Quick Configuration Checklist

Before running `./deploy-to-azure.sh`, verify:

- [ ] **Subscription ID/Name** is correct in `deploy-to-azure.sh`
- [ ] **Resource Group name** is what you want (will be created if doesn't exist)
- [ ] **Azure region** is your preferred location
- [ ] **Resource names** are unique and follow Azure naming conventions
- [ ] **Database configuration** matches your needs (new vs existing)
- [ ] **Application ports** match your application configuration
- [ ] You have **Owner or Contributor** permissions on the Azure subscription

### 8. Testing Your Configuration

Before full deployment, you can test your configuration:

```bash
# Test Azure login and subscription access
az login
az account set --subscription "Your-Azure-Subscription"
az account show

# Test resource group creation (optional)
az group create --name "rg-testlatest" --location "eastus" --dry-run
```

## Deployment Options

You have two main deployment options:

### Option 1: Automated Deployment Script (Recommended)

This is the fastest way to get your application running on Azure.

1. **Login to Azure:**
   ```bash
   az login
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy-to-azure.sh
   ```

   The script will:
   - Create all necessary Azure resources
   - Build and push Docker images to your container registry
   - Deploy both frontend and backend
   - Configure the database connection
   - Provide you with the live URLs

### Option 2: Manual Deployment

If you prefer more control over the deployment process:

#### Step 1: Create Azure Resources

1. **Create Resource Group:**
   ```bash
   az group create --name rg-testlatest --location "eastus"
   ```

2. **Create Container Registry:**
   ```bash
   az acr create --resource-group rg-testlatest --name acrtestlatest --sku Basic --admin-enabled true
   ```

3. **Create Key Vault:**
   ```bash
   az keyvault create \
     --name kv-testlatest \
     --resource-group rg-testlatest \
     --location "eastus"
   ```

4. **Create PostgreSQL Database (if needed):**
   ```bash
   az postgres flexible-server create \
     --resource-group rg-testlatest \
     --name acrtestlatest-pg \
     --location "eastus" \
     --admin-user postgres \
     --admin-password "YourSecurePassword" \
     --sku-name Standard_B1ms \
     --tier Burstable \
     --storage-size 32 \
     --version 15
   ```

5. **Create Container Apps Environment:**
   ```bash
   az containerapp env create \
     --name env-testlatest \
     --resource-group rg-testlatest \
     --location "eastus"
   ```

#### Step 2: Build and Push Images

1. **Login to Container Registry:**
   ```bash
   az acr login --name acrtestlatest
   ```

2. **Build and push backend:**
   ```bash
   cd backend
   docker build --platform linux/amd64 -t acrtestlatest.azurecr.io/testlatest-backend:latest .
   docker push acrtestlatest.azurecr.io/testlatest-backend:latest
   cd ..
   ```

3. **Build and push frontend:**
   ```bash
   cd frontend
   docker build --platform linux/amd64 -t acrtestlatest.azurecr.io/testlatest-frontend:latest .
   docker push acrtestlatest.azurecr.io/testlatest-frontend:latest
   cd ..
   ```

#### Step 3: Deploy Applications

1. **Deploy Backend:**
   ```bash
   az containerapp create \
     --name testlatest-backend \
     --resource-group rg-testlatest \
     --environment env-testlatest \
     --image acrtestlatest.azurecr.io/testlatest-backend:latest \
     --target-port 8080 \
     --ingress external \
     --min-replicas 1 \
     --max-replicas 3 \
     --env-vars \
       SPRING_PROFILES_ACTIVE=azure \
       SPRING_DATASOURCE_URL="jdbc:postgresql://acrtestlatest-pg.postgres.database.azure.com:5432/testlatest_db" \
       SPRING_DATASOURCE_USERNAME=postgres \
       SPRING_DATASOURCE_PASSWORD="YourDatabasePassword"
   ```

2. **Deploy Frontend:**
   ```bash
   az containerapp create \
     --name testlatest-frontend \
     --resource-group rg-testlatest \
     --environment env-testlatest \
     --image acrtestlatest.azurecr.io/testlatest-frontend:latest \
     --target-port 5173 \
     --ingress external \
     --min-replicas 1 \
     --max-replicas 3 \
     --env-vars \
       BACKEND_API_URL=https://testlatest-backend.eastus.azurecontainerapps.io
   ```

## GitHub Actions CI/CD Setup

For automated deployments when you push to GitHub:

### Step 1: Create Azure Service Principal

```bash
az ad sp create-for-rbac --name "testlatest-github-actions" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-testlatest \
  --sdk-auth
```

### Step 2: Add GitHub Secrets

In your GitHub repository, go to Settings > Secrets and add:

- `AZURE_CREDENTIALS`: Output from the service principal creation
- `ACR_USERNAME`: `acrtestlatest`
- `ACR_PASSWORD`: Your container registry password
- `DATABASE_URL`: Your database connection string

### Step 3: Push to GitHub

The GitHub Actions workflow will automatically trigger on pushes to the main branch and deploy to:
- **Frontend**: `https://testlatest-frontend.eastus.azurecontainerapps.io`
- **Backend**: `https://testlatest-backend.eastus.azurecontainerapps.io`

## Cost Estimation

Here's an approximate monthly cost breakdown for running this application on Azure:

| Service | Configuration | Estimated Cost |
|---------|---------------|----------------|
| Container Apps | 2 apps, 1-3 replicas each | $30-60/month |
| PostgreSQL Flexible Server | Standard_B1ms | $15-25/month |
| Container Registry | Basic tier | $5/month |
| **Total** | | **$50-90/month** |

*Costs may vary based on usage and region*

## Monitoring and Maintenance

### Health Checks

Your application includes health check endpoints:
- Backend: `https://testlatest-backend.eastus.azurecontainerapps.io/actuator/health`
- Frontend: `https://testlatest-frontend.eastus.azurecontainerapps.io/`

### Scaling

Azure Container Apps automatically scales based on demand. You can adjust scaling rules:

```bash
az containerapp update \
  --name testlatest-backend \
  --resource-group rg-testlatest \
  --min-replicas 1 \
  --max-replicas 5
```

### Logs

View application logs:

```bash
# Backend logs
az containerapp logs show --name testlatest-backend --resource-group rg-testlatest

# Frontend logs
az containerapp logs show --name testlatest-frontend --resource-group rg-testlatest
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is included in backend CORS configuration
2. **Database Connection**: Verify SSL mode and connection string format
3. **Build Failures**: Ensure Docker is running and you have sufficient disk space
4. **Image Push Failures**: Verify ACR credentials and permissions

### Getting Help

- Check Azure Container Apps documentation: [docs.microsoft.com](https://docs.microsoft.com/en-us/azure/container-apps/)
- View application logs for detailed error messages
- Use Azure Portal for visual monitoring and debugging

## Security Considerations

1. **Database Security**: SSL required for all connections
2. **Container Registry**: Admin access managed through secure credentials
3. **Environment Variables**: Sensitive data managed through Azure Key Vault integration
4. **Network Security**: HTTPS-only communication enforced

## Next Steps

After deployment:

1. Test application functionality
2. Set up custom domain names
3. Configure SSL certificates
4. Set up monitoring and alerting
5. Implement backup strategies
6. Configure staging environments

Your testlatest application is now ready for production use on Azure! 🚀 