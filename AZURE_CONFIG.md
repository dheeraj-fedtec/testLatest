# Azure Configuration Reference for testlatest

This file contains all the configuration values you may need to customize for your Azure deployment.

## 📋 Configuration Checklist

Copy this checklist and fill in your specific values before deployment:

### Basic Azure Settings
```bash
# Your Azure subscription (ID or name)
SUBSCRIPTION="Your-Azure-Subscription"

# Azure region where resources will be created
LOCATION="eastus"

# Resource group name (will be created if doesn't exist)
RESOURCE_GROUP="rg-testlatest"
```

### Resource Names (Must be globally unique)
```bash
# Container Registry name (3-50 chars, alphanumeric only)
ACR_NAME="acrtestlatest"

# Key Vault name (3-24 chars, alphanumeric + hyphens)
KEY_VAULT_NAME="kv-testlatest"

# Container Apps Environment name
CONTAINER_APP_ENV="env-testlatest"

# Application names
BACKEND_APP_NAME="testlatest-backend"
FRONTEND_APP_NAME="testlatest-frontend"
```

### Database Configuration
```bash
# Choose one option:

# Option A: Create new PostgreSQL database
USE_EXISTING_DB=false
DB_NAME="testlatest_db"
DB_USERNAME="{{DB_USERNAME}}"
# Password will be auto-generated

# Option B: Use existing database
# USE_EXISTING_DB=true
# EXISTING_DB_FQDN="your-db.postgres.database.azure.com"
# DB_NAME="your_database"
# DB_USERNAME="your_username"
# DB_PASSWORD="your_password"
```

### Application Ports
```bash
BACKEND_PORT=8080
FRONTEND_PORT=5173
```

## 🔧 Files to Update

After filling out the configuration above, update these files:

### 1. `deploy-to-azure.sh`
Update the configuration section at the top:
```bash
RESOURCE_GROUP="your-resource-group"
LOCATION="your-region"
ACR_NAME="your-acr-name"
KEY_VAULT_NAME="your-keyvault-name"
SUBSCRIPTION="your-subscription"
# ... etc
```

### 2. `setup-github-actions.sh`
Update to match your deploy-to-azure.sh settings:
```bash
RESOURCE_GROUP="your-resource-group"
SUBSCRIPTION="your-subscription"
```

### 3. `.github/workflows/azure-deploy.yml`
Update environment variables:
```yaml
env:
  AZURE_CONTAINER_REGISTRY: "your-acr-name.azurecr.io"
  RESOURCE_GROUP: "your-resource-group"
  # ... etc
```

### 4. `backend/src/main/resources/application-azure.properties`
Update Key Vault URI and CORS settings:
```properties
azure.keyvault.uri=https://your-keyvault-name.vault.azure.net/
cors.allowed-origins=${FRONTEND_URL:http://localhost:your-frontend-port}
```

## 🌍 Common Azure Regions

Choose the region closest to your users:

| Region Code | Location | Description |
|-------------|----------|-------------|
| `eastus` | East US | Virginia |
| `eastus2` | East US 2 | Virginia |
| `westus2` | West US 2 | Washington |
| `westus3` | West US 3 | Arizona |
| `centralus` | Central US | Iowa |
| `westeurope` | West Europe | Netherlands |
| `northeurope` | North Europe | Ireland |
| `uksouth` | UK South | London |
| `eastasia` | East Asia | Hong Kong |
| `southeastasia` | Southeast Asia | Singapore |
| `japaneast` | Japan East | Tokyo |
| `australiaeast` | Australia East | Sydney |

## ⚠️ Important Notes

1. **Resource Names**: Container Registry and Key Vault names must be globally unique across all Azure customers
2. **Permissions**: You need Owner or Contributor role on the Azure subscription
3. **Costs**: Review the cost estimation in AZURE_DEPLOYMENT_GUIDE.md
4. **Database**: If using an existing database, ensure it's accessible from Azure Container Apps
5. **Ports**: Make sure your application actually runs on the specified ports

## 🧪 Testing Your Configuration

Before full deployment, test your settings:

```bash
# Test Azure CLI access
az login
az account set --subscription "your-subscription"
az account show

# Test resource group access/creation
az group show --name "your-resource-group" || \
az group create --name "your-resource-group" --location "your-region"

# Test unique name availability
az acr check-name --name "your-acr-name"
az keyvault list --query "[?name=='your-keyvault-name']"
```

## 🚀 Quick Start Commands

After configuring everything:

```bash
# 1. Deploy infrastructure and application
./deploy-to-azure.sh

# 2. Set up GitHub Actions (optional)
./setup-github-actions.sh

# 3. Check deployment status
az containerapp list --resource-group "your-resource-group" --output table
```

## 📞 Getting Help

If you encounter issues:

1. Check the detailed troubleshooting section in `AZURE_DEPLOYMENT_GUIDE.md`
2. Verify all configuration values are correct
3. Ensure you have the required Azure permissions
4. Check Azure CLI version: `az --version`
5. Review Azure Container Apps documentation: https://docs.microsoft.com/en-us/azure/container-apps/ 