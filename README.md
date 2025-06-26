# ks-frontend

:warning: Because of bun hoisting issues, the mobile app is not part of the monorepo workspace.

## Environment Setup

This project uses GCP Secret Manager for managing environment variables across all applications. Each secret contains the complete `.env` file content for its respective app.

### Setup Instructions

1. Install and configure Google Cloud CLI:
```sh
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login
```

2. Install jq for JSON parsing:
```sh
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

3. Configure your secrets:
```sh
# Edit the configuration file with your actual values
# Update projectId and secret names as needed
nano env-config.json
```

4. Create your secrets in GCP (complete .env files):
```sh
# Create secret for web app from existing .env file
gcloud secrets create mono-web-env --data-file=apps/web/.env

# Or create from multiline content
gcloud secrets create mono-web-env --data-file=- <<EOF
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
API_KEY=your-api-key
EOF

# Create secret for expo app
gcloud secrets create mono-expo-env --data-file=apps/expo/.env

# Create secret for extension
gcloud secrets create mono-ext-env --data-file=apps/ext/.env
```

5. Initialize environment files:
```sh
# Initialize all apps at once (recommended)
pnpm env:init
# or
pnpm init
# or  
pnpm start

# Initialize specific apps
pnpm env:init:web
pnpm env:init:expo
pnpm env:init:ext

# Or use the scripts directly
./scripts/init-all-env.sh    # All apps
./scripts/init-env.sh web    # Single app
```

The `pnpm env:init` command will attempt to initialize all apps and continue even if some fail, giving you a summary at the end.

## Git Submodules

This project uses Git submodules to manage shared libraries. The `libs` directory contains the `web-golem` library as a submodule.

### Initializing Submodules

After cloning the repository, you need to initialize and update the submodules:

```sh
# Initialize and update all submodules
git submodule update --init --recursive

# Or do it in two steps
git submodule init
git submodule update
```

### Updating Submodules

To update submodules to their latest versions:

```sh
# Update all submodules to their latest commit
git submodule update --remote
```

## VSCode Extensions

This project includes recommended extensions in `.vscode/extensions.json`. To ensure everyone on the team installs these extensions:

1. When you open the project in VSCode for the first time, you'll see a notification in the bottom right corner asking if you want to install the recommended extensions.
2. Click "Install All" to install all the recommended extensions at once.
3. Alternatively, you can view and install them manually by:
   - Opening the Extensions view
   - Typing "@recommended" in the search box
   - Installing the extensions shown under "Workspace Recommendations"

If you find an extension useful for this project, please update the `.vscode/extensions.json` file and document why it's beneficial in your PR.
