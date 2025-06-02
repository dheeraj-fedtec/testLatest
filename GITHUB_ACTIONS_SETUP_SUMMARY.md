# GitHub Actions Setup Summary

## ✅ What Has Been Updated

Based on your Azure deployment script (`deploy-to-azure.sh`), I have updated the following files to match your actual Azure configuration:

### 1. `setup-github-actions.sh` - Updated Configuration
- **Resource Group**: `FTC-GGB-DEV` (was: `rg-testlatest`)
- **Subscription**: `FTC-GGB-Subscription` (was: `Your-Azure-Subscription`)
- **ACR Name**: `acrftcggbdev` (was: `acrtestlatest`)
- **Key Vault Name**: `kv-apis-ftcggbdev` (was: `kv-testlatest`)
- **Database Name**: `citus` (was: `testlatest_db`)
- **Database Username**: `citus` (was: `postgres`)
- **Database FQDN**: `c-ftc-ggb-dev.ffwb6hfvooklec.postgres.cosmos.azure.com`
- **Database URL**: Updated to use the existing Cosmos DB for PostgreSQL

### 2. `.github/workflows/azure-deploy.yml` - Updated Database Username
- **Database Username**: Changed from `postgres` to `citus` in the backend deployment step

## 🚀 Next Steps

### Step 1: Run the Setup Script
Execute the updated setup script to generate your GitHub secrets:

```bash
./setup-github-actions.sh
```

This will:
- Create a service principal for GitHub Actions
- Retrieve ACR credentials
- Generate all required secrets
- Save them to `github-secrets.txt`

### Step 2: Add Secrets to GitHub Repository
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets (values will be provided by the setup script):

1. **AZURE_CREDENTIALS** - Service principal credentials for Azure login
2. **ACR_USERNAME** - Azure Container Registry username
3. **ACR_PASSWORD** - Azure Container Registry password
4. **DATABASE_URL** - PostgreSQL connection string
5. **DATABASE_USERNAME** - Database username (`citus`)
6. **DATABASE_PASSWORD** - Database password

### Step 3: Test the Workflow
1. Push your code to the `main` branch
2. Watch the GitHub Actions workflow run automatically
3. Check the deployment summary in the Actions tab

## 📋 Current Configuration Summary

| Component | Value |
|-----------|-------|
| Resource Group | `FTC-GGB-DEV` |
| Subscription | `FTC-GGB-Subscription` |
| ACR Name | `acrftcggbdev` |
| ACR URL | `acrftcggbdev.azurecr.io` |
| Key Vault | `kv-apis-ftcggbdev` |
| Container App Environment | `env-ftc-ggb-dev` |
| Backend App | `testlatest-backend` |
| Frontend App | `testlatest-frontend` |
| Database | `citus` on Cosmos DB for PostgreSQL |

## 🔧 Manual Deployment vs GitHub Actions

Your current setup supports both:

1. **Manual Deployment**: Use `./deploy-to-azure.sh` for one-time or manual deployments
2. **Automated Deployment**: GitHub Actions will automatically deploy when you push to `main` branch

The GitHub Actions workflow will:
- Build and test your backend (Java/Maven)
- Build your frontend (Node.js/npm)
- Push Docker images to ACR
- Deploy to Azure Container Apps
- Provide deployment summaries

## ⚠️ Important Notes

1. **Database Password**: The setup script will try to retrieve the password from Key Vault. If not found, it will use the password from your deploy script (`WEtN4nI39rzeyM75`).

2. **Service Principal**: A new service principal will be created each time you run the setup script. You may want to clean up old ones periodically.

3. **Security**: Delete the `github-secrets.txt` file after adding secrets to GitHub for security.

4. **Environment**: The workflow deploys to a `production` environment, which may require approval in GitHub if you have protection rules enabled.

## 🐛 Troubleshooting

If the GitHub Actions workflow fails:

1. Check that all secrets are correctly added to GitHub
2. Verify the service principal has the correct permissions
3. Ensure your Azure resources exist (run `./deploy-to-azure.sh` if needed)
4. Check the workflow logs for specific error messages

For more detailed information, see:
- `AZURE_DEPLOYMENT_GUIDE.md`
- `GITHUB_ACTIONS_GUIDE.md` 