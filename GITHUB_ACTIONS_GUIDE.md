# GitHub Actions CI/CD Guide for testlatest

This guide explains how to use the GitHub Actions workflows that have been set up for your testlatest project.

## 📋 Overview

Your project includes the following GitHub Actions workflows:

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`) - Builds, tests, and validates your code
2. **Pull Request Protection** (`.github/workflows/pull-request-protection.yml`) - Enforces code review process
3. **CODEOWNERS** - Defines who must review changes to different parts of the codebase

## 🚀 CI/CD Pipeline Features

### Automatic Triggers
- **Push to main/develop**: Runs full build and test suite
- **Pull Requests**: Validates changes before merge
- **Manual Dispatch**: Allows manual triggering with custom options

### What It Does
- ✅ **Detects Changes**: Only builds/tests components that have changed
- ✅ **Multi-Language Support**: Automatically detects Java, .NET, Python, or Node.js
- ✅ **Comprehensive Testing**: Runs unit tests with coverage reports
- ✅ **Code Quality**: Performs security scans and dependency checks
- ✅ **Build Artifacts**: Creates deployable packages
- ✅ **Detailed Reporting**: Provides build summaries and test results

### Supported Technologies

#### Backend
- **Java Spring Boot**: Maven builds, JUnit tests, JaCoCo coverage
- **.NET**: dotnet builds, xUnit tests, code coverage
- **Python FastAPI**: pip installs, pytest, coverage reports

#### Frontend
- **React**: npm builds, Jest tests, ESLint
- **Angular**: npm builds, Karma/Jasmine tests, Angular CLI

## 🛡️ Pull Request Protection

### Branch Protection Rules
- **Direct pushes to main are blocked** (except for initial setup)
- **All changes must go through Pull Requests**
- **Code owners must approve changes**

### PR Quality Checks
- ✅ **Title and Description Validation**
- ✅ **PR Size Analysis** (warns about large PRs)
- ✅ **Merge Conflict Detection**
- ✅ **Sensitive File Detection**
- ✅ **Commit Message Analysis**

## 🔧 Setup Instructions

### 1. Initial Repository Setup

After pushing your code to GitHub:

```bash
# Push your code to GitHub
git add .
git commit -m "Initial commit with GitHub Actions setup"
git push origin main
```

### 2. Configure Repository Settings

1. **Go to your GitHub repository**
2. **Navigate to Settings > Branches**
3. **Add branch protection rule for `main`**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators in restrictions

### 3. Set Up Code Owners

The `CODEOWNERS` file is already configured with placeholder values. Update it:

```bash
# Edit CODEOWNERS file
# Replace @your-github-username with your actual GitHub username
```

### 4. Configure Secrets (if needed)

For advanced features, you may need to add repository secrets:

1. **Go to Settings > Secrets and variables > Actions**
2. **Add any required secrets**:
   - `SONAR_TOKEN` (for SonarQube integration)
   - `DOCKER_USERNAME` and `DOCKER_PASSWORD` (for Docker Hub)
   - Cloud provider credentials (for deployment)

## 📊 Understanding Workflow Results

### Build Status
- ✅ **Green checkmark**: All checks passed
- ❌ **Red X**: Some checks failed
- 🟡 **Yellow circle**: Checks are running

### Viewing Details
1. **Click on the status check** in your PR or commit
2. **Expand job sections** to see detailed logs
3. **Download artifacts** for build outputs and test reports

### Build Artifacts
The workflows generate several artifacts:
- **Backend builds**: JAR files, .NET assemblies, Python packages
- **Frontend builds**: Compiled static assets
- **Test reports**: Coverage reports and test results
- **Security reports**: Dependency vulnerability scans

## 🔄 Workflow Customization

### Modifying the CI/CD Pipeline

Edit `.github/workflows/ci-cd.yml` to:

#### Change Node.js/Java/Python Versions
```yaml
env:
  NODE_VERSION: '20'      # Change Node.js version
  JAVA_VERSION: '21'      # Change Java version
  PYTHON_VERSION: '3.11'  # Change Python version
```

#### Add Custom Build Steps
```yaml
- name: Custom Build Step
  run: |
    echo "Running custom build commands..."
    # Add your custom commands here
```

#### Modify Test Commands
```yaml
- name: Run Custom Tests
  working-directory: ./backend
  run: |
    # Replace with your test commands
    mvn test -Dspring.profiles.active=test
```

### Adding New Workflows

Create new workflow files in `.github/workflows/`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  release:
    types: [published]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Add deployment steps
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Tests Failing
```bash
# Check test logs in the workflow run
# Fix failing tests locally first:
npm test                    # Frontend
mvn test                   # Java backend
dotnet test               # .NET backend
pytest                    # Python backend
```

#### 2. Build Failures
```bash
# Ensure your code builds locally:
npm run build             # Frontend
mvn clean package        # Java backend
dotnet build             # .NET backend
```

#### 3. Permission Issues
- Ensure your GitHub token has the required permissions
- Check if branch protection rules are too restrictive
- Verify CODEOWNERS file syntax

#### 4. Workflow Not Triggering
- Check the `on:` triggers in your workflow file
- Ensure you're pushing to the correct branch
- Verify the workflow file is in `.github/workflows/`

### Getting Help

1. **Check workflow logs** for detailed error messages
2. **Review GitHub Actions documentation**: https://docs.github.com/en/actions
3. **Validate YAML syntax**: Use online YAML validators
4. **Test locally** before pushing to ensure builds work

## 📈 Best Practices

### For Developers
1. **Always create feature branches** for new work
2. **Write descriptive commit messages**
3. **Keep PRs small and focused** (< 500 lines when possible)
4. **Add tests** for new functionality
5. **Update documentation** when needed

### For Maintainers
1. **Review PR quality checks** before approving
2. **Ensure CI passes** before merging
3. **Use squash and merge** for cleaner history
4. **Tag releases** for deployment tracking
5. **Monitor workflow performance** and optimize as needed

## 🔗 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Code Owners Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

**Generated for testlatest** | Last updated: $(date) 