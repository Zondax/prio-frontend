# Starter base

A starting point to help you set up your project quickly and use the common components provided by `react-native-reusables`. The idea is to make it easier for you to get started.

## Features

- NativeWind v4
- Dark and light mode
  - Android Navigation Bar matches mode
  - Persistent mode
- Common components
  - ThemeToggle, Avatar, Button, Card, Progress, Text, Tooltip

<img src="https://github.com/mrzachnugent/react-native-reusables/assets/63797719/42c94108-38a7-498b-9c70-18640420f1bc"
     alt="starter-base-template"
     style="width:270px;" />

## Known Issues and Fixes

### Android Build with pnpm

If encountering `cannot find symbol import expo.core.ExpoModulesPackage` error when building for Android using pnpm, we've added `"expo-modules-autolinking": "*"` to fix this issue.

Reference: [expo/eas-cli#2789](https://github.com/expo/eas-cli/issues/2789)

The fix involves adding `"expo-modules-autolinking": "*"` to package.json, which helps pnpm find the correct dependencies during the Android build process.
