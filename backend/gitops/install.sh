#!/bin/bash

# Color setup
red=$(tput setaf 1)
yellow=$(tput setaf 3)
green=$(tput setaf 2)
blue=$(tput setaf 4)
reset=$(tput sgr0)

# Default configuration for Innovationlabs Java Spring Boot Template
DEFAULT_LOCATION="westus2"
DEFAULT_RESOURCE_GROUP="Innovationlabs"
DEFAULT_APP_NAME="java-spring-template"
DEFAULT_APP_SERVICE_PLAN="java-spring-template-plan"
DEFAULT_RUNTIME="JAVA:21-java21"
DEFAULT_KEY_VAULT_NAME="kv-apis-innovationlab"
DEFAULT_DB_NAME="innovationlabs-development"
DEFAULT_SUBSCRIPTION="Subscription 4- FedTecRND"
DEFAULT_PRINCIPAL_NAME="GithubPrincipal"
GITHUB_ORG="free-alliance"

# Utility functions
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Azure CLI
if ! command_exists az; then
    echo "${red}Error: Azure CLI ('az') is not installed. Please install it first: https://aka.ms/install-azure-cli${reset}" >&2
    exit 1
fi

# Print configuration
cat <<EOF
${yellow}=== Java Spring Boot Template GitOps Installer ===${reset}

Default Location: $DEFAULT_LOCATION
Resource Group: $DEFAULT_RESOURCE_GROUP
App Name: $DEFAULT_APP_NAME
App Service Plan: $DEFAULT_APP_SERVICE_PLAN
Runtime: $DEFAULT_RUNTIME
Key Vault: $DEFAULT_KEY_VAULT_NAME
Database Name: $DEFAULT_DB_NAME
Subscription: $DEFAULT_SUBSCRIPTION
Principal Name: $DEFAULT_PRINCIPAL_NAME
GitHub Org: $GITHUB_ORG
EOF

# Prompt for Azure subscription
read -p "Enter Azure subscription name [${DEFAULT_SUBSCRIPTION}]: " AZURE_SUBSCRIPTION
AZURE_SUBSCRIPTION=${AZURE_SUBSCRIPTION:-$DEFAULT_SUBSCRIPTION}

# Login to Azure (uncomment to enable)
# echo "${blue}Logging in to Azure...${reset}"
# az login --scope https://management.core.windows.net//.default || { echo "Azure login failed"; exit 1; }
# az account set --subscription "$AZURE_SUBSCRIPTION" || { echo "Failed to set subscription"; exit 1; }

# Prompt for resource group
read -p "Enter resource group name [${DEFAULT_RESOURCE_GROUP}]: " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-$DEFAULT_RESOURCE_GROUP}

# Prompt for app name
read -p "Enter app name [${DEFAULT_APP_NAME}]: " APP_NAME
APP_NAME=${APP_NAME:-$DEFAULT_APP_NAME}

# Prompt for app service plan
read -p "Enter app service plan [${DEFAULT_APP_SERVICE_PLAN}]: " APP_SERVICE_PLAN
APP_SERVICE_PLAN=${APP_SERVICE_PLAN:-$DEFAULT_APP_SERVICE_PLAN}

# Prompt for runtime
read -p "Enter runtime [${DEFAULT_RUNTIME}]: " APP_RUNTIME
APP_RUNTIME=${APP_RUNTIME:-$DEFAULT_RUNTIME}

# Prompt for key vault
read -p "Enter key vault name [${DEFAULT_KEY_VAULT_NAME}]: " KEY_VAULT
KEY_VAULT=${KEY_VAULT:-$DEFAULT_KEY_VAULT_NAME}

# Prompt for database name
read -p "Enter database name [${DEFAULT_DB_NAME}]: " DB_NAME
DB_NAME=${DB_NAME:-$DEFAULT_DB_NAME}

# Prompt for principal name
read -p "Enter principal name [${DEFAULT_PRINCIPAL_NAME}]: " PRINCIPAL_NAME
PRINCIPAL_NAME=${PRINCIPAL_NAME:-$DEFAULT_PRINCIPAL_NAME}

# Prompt for GitHub org
read -p "Enter GitHub org [${GITHUB_ORG}]: " GITHUB_ORG_INPUT
GITHUB_ORG=${GITHUB_ORG_INPUT:-$GITHUB_ORG}

# Create resource group if it doesn't exist
if ! az group show --name "$RESOURCE_GROUP" &>/dev/null; then
    echo "${blue}Creating resource group: $RESOURCE_GROUP in $DEFAULT_LOCATION...${reset}"
    az group create --location $DEFAULT_LOCATION --name $RESOURCE_GROUP
else
    echo "${green}Resource group $RESOURCE_GROUP already exists.${reset}"
fi

# Create App Service Plan if it doesn't exist
if ! az appservice plan show --name "$APP_SERVICE_PLAN" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
    echo "${blue}Creating App Service Plan: $APP_SERVICE_PLAN...${reset}"
    az appservice plan create -n $APP_SERVICE_PLAN -g $RESOURCE_GROUP --sku B1 --is-linux
else
    echo "${green}App Service Plan $APP_SERVICE_PLAN already exists.${reset}"
fi

# Create Web App if it doesn't exist
if ! az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
    echo "${blue}Creating Web App: $APP_NAME...${reset}"
    az webapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime $APP_RUNTIME
else
    echo "${green}Web App $APP_NAME already exists.${reset}"
fi

# Create Key Vault if it doesn't exist
if ! az keyvault show --name "$KEY_VAULT" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
    echo "${blue}Creating Key Vault: $KEY_VAULT...${reset}"
    az keyvault create --name $KEY_VAULT --resource-group $RESOURCE_GROUP --location $DEFAULT_LOCATION
else
    echo "${green}Key Vault $KEY_VAULT already exists.${reset}"
fi

# Example output for next steps
cat <<EON

${green}Setup complete!${reset}

# Next steps (manual or uncomment above Azure CLI commands):
# - Create resource group: az group create --location $DEFAULT_LOCATION --name $RESOURCE_GROUP
# - Create app service plan: az appservice plan create -n $APP_SERVICE_PLAN -g $RESOURCE_GROUP --sku B1 --is-linux
# - Create web app: az webapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime $APP_RUNTIME
# - Create key vault: az keyvault create --name $KEY_VAULT --resource-group $RESOURCE_GROUP --location $DEFAULT_LOCATION

# - Configure GitHub Actions secrets for Azure deployment
# - Deploy your Java 21 Spring Boot app!

EON 