# ks-frontend

:warning: Because of bun hoisting issues, the mobile app is not part of the monorepo workspace.

## 1Password integration

```sh
brew install --cask 1password-cli
```

- Open the 1Password app.
- Navigate to Settings > Security and turn on Touch ID, Windows Hello, or a Linux system authentication option.
- Navigate to Developer > Settings and select Integrate with 1Password CLI.

login to 1Password:

```sh
op signin
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
