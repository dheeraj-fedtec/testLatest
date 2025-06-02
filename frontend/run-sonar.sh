#!/bin/bash

# SonarQube analysis automation script with project creation for React project
# Usage: ./run-sonar.sh [token]

# Configuration
SONAR_HOST="http://localhost:9000"
PROJECT_KEY="react-uswds-template"
PROJECT_NAME="React USWDS Template"

# Get token - from argument, env var, or file
if [ $# -eq 1 ]; then
  TOKEN="$1"
else
  if [ -z "$SONAR_TOKEN" ]; then
    if [ -f "sonar-token.txt" ]; then
      TOKEN=$(cat sonar-token.txt)
    else
      echo "Error: SonarQube token not provided"
      echo "Usage: ./run-sonar.sh [token]"
      echo "Or set SONAR_TOKEN environment variable"
      echo "Or create a sonar-token.txt file with your token"
      exit 1
    fi
  else
    TOKEN="$SONAR_TOKEN"
  fi
fi

# Check if curl is installed
if ! command -v curl &> /dev/null; then
  echo "Error: curl is required but not installed. Please install curl."
  exit 1
fi

# Check if jq is installed (for JSON parsing)
if ! command -v jq &> /dev/null; then
  echo "Warning: jq is not installed. Project existence check will be skipped."
  JQ_INSTALLED=false
else
  JQ_INSTALLED=true
fi

echo "Using SonarQube at $SONAR_HOST"

# Check if project exists
if [ "$JQ_INSTALLED" = true ]; then
  echo "Checking if project exists..."
  PROJECT_EXISTS=$(curl -s -u "$TOKEN:" "$SONAR_HOST/api/components/show?component=$PROJECT_KEY" | jq -r '.component.key // empty')
  
  if [ -z "$PROJECT_EXISTS" ]; then
    echo "Project does not exist. Creating project..."
    CREATE_RESPONSE=$(curl -s -X POST -u "$TOKEN:" "$SONAR_HOST/api/projects/create" \
      -d "name=$PROJECT_NAME" \
      -d "project=$PROJECT_KEY")
    
    if echo "$CREATE_RESPONSE" | grep -q "error"; then
      echo "Failed to create project. Response:"
      echo "$CREATE_RESPONSE"
      echo "Will attempt analysis anyway..."
    else
      echo "Project created successfully."
    fi
  else
    echo "Project already exists."
  fi
else
  echo "Skipping project existence check (jq not installed)."
fi

# Run ESLint report generation
echo "Generating ESLint report..."
npm run lint:report

# Run SonarQube Scanner
echo "Running SonarQube analysis..."
if command -v sonar-scanner &> /dev/null; then
  # Use local sonar-scanner installation
  sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST" \
    -Dsonar.login="$TOKEN"
elif [ -d "node_modules/.bin/sonar-scanner" ]; then
  # Use sonar-scanner from node_modules
  node_modules/.bin/sonar-scanner \
    -Dsonar.host.url="$SONAR_HOST" \
    -Dsonar.login="$TOKEN"
else
  echo "Error: sonar-scanner not found. Please install it globally or as a dev dependency."
  echo "You can install it with: npm install -D sonarqube-scanner"
  exit 1
fi

# Check if analysis was successful
if [ $? -eq 0 ]; then
  echo "SonarQube analysis completed successfully!"
  echo "View results at: $SONAR_HOST/dashboard?id=$PROJECT_KEY"
else
  echo "SonarQube analysis failed."
fi 