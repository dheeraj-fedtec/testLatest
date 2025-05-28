# Generated FedTec Project

This project was generated using the FedTec Lab Starter Stack with:
- Frontend: react-uswds
- Backend: java-springboot
- Database: PostgreSQL
- CI/CD: GitHub Actions
- Cloud: Azure

## Getting Started

### Frontend
```bash
cd frontend

```

### Backend
```bash
cd backend

```

For more detailed instructions, see the README files in the frontend and backend directories.

## Development
- Frontend runs on: http://localhost:5173
- Backend API available at: http://localhost:8080

## Azure Deployment

This project includes Azure deployment configuration:

### Quick Start
1. **Configure Azure settings**: Open `AZURE_CONFIG.md` and fill in your Azure details
2. **Update deployment script**: Modify `deploy-to-azure.sh` with your configuration
3. **Deploy to Azure**: Run `./deploy-to-azure.sh`

### Configuration Files
- `AZURE_CONFIG.md` - Configuration reference and checklist
- `deploy-to-azure.sh` - Main deployment script
- `AZURE_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `setup-github-actions.sh` - GitHub Actions CI/CD setup

### Important Notes
⚠️ **Before deploying**: Update your Azure subscription, resource names, and database configuration in the deployment script.

## GitHub Actions CI/CD

This project includes comprehensive GitHub Actions workflows:

### Features
- ✅ **Automated builds and tests** on push and pull requests
- ✅ **Multi-language support** (Java, .NET, Python, Node.js)
- ✅ **Code quality checks** and security scanning
- ✅ **Pull request protection** and validation
- ✅ **Build artifacts** and test reports

### Workflow Files
- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/pull-request-protection.yml` - PR validation
- `CODEOWNERS` - Code review requirements
- `GITHUB_ACTIONS_GUIDE.md` - Detailed setup guide

### Quick Setup
1. **Update CODEOWNERS**: Replace `your-github-username` with your GitHub username
2. **Push to GitHub**: `git push origin main`
3. **Configure branch protection**: Enable in repository settings
4. **Review guide**: See `GITHUB_ACTIONS_GUIDE.md` for complete instructions

### Automatic Triggers
- **Push to main/develop**: Full build and test suite
- **Pull requests**: Validation and quality checks
- **Manual dispatch**: Custom build options

## Project Structure
```
testLatest/
├── frontend/          # Frontend application
├── backend/           # Backend application
├── .github/           # GitHub Actions workflows
├── deploy-to-azure.sh # Azure deployment script
├── AZURE_CONFIG.md    # Azure configuration guide
├── CODEOWNERS         # Code review requirements
└── README.md          # This file
```

## Next Steps
1. **Set up your development environment** following the instructions above
2. **Review the configuration files** for your selected options
3. **Configure GitHub Actions** using the provided guide
3. **Set up Azure deployment** using the configuration files
4. **Start developing** your application!

## Support
- Check the individual README files in frontend/ and backend/ directories
- Review GITHUB_ACTIONS_GUIDE.md for CI/CD setup
- Review AZURE_DEPLOYMENT_GUIDE.md for deployment help
- Refer to the FedTec Lab documentation for additional guidance
