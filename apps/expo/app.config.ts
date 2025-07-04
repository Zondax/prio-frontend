import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'kickstarter',
  slug: 'kickstarter',
  version: '0.2.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'kickstarter',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/ks-logo-light.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'ks.zondax.ch',
    usesAppleSignIn: false,
    requireFullScreen: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'ks.zondax.ch',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/ks-logo-light.png',
        backgroundColor: '#ffffff',
        imageWidth: 200,
        dark: {
          image: './assets/images/ks-logo-dark.png',
          backgroundColor: '#000000',
        },
      },
    ],
    [
      'expo-font',
      {
        android: {
          fonts: [
            './assets/fonts/figtree/Figtree-Black.ttf',
            './assets/fonts/figtree/Figtree-BlackItalic.ttf',
            './assets/fonts/figtree/Figtree-Bold.ttf',
            './assets/fonts/figtree/Figtree-BoldItalic.ttf',
            './assets/fonts/figtree/Figtree-ExtraBold.ttf',
            './assets/fonts/figtree/Figtree-ExtraBoldItalic.ttf',
            './assets/fonts/figtree/Figtree-Italic.ttf',
            './assets/fonts/figtree/Figtree-Light.ttf',
            './assets/fonts/figtree/Figtree-LightItalic.ttf',
            './assets/fonts/figtree/Figtree-Medium.ttf',
            './assets/fonts/figtree/Figtree-MediumItalic.ttf',
            './assets/fonts/figtree/Figtree-Regular.ttf',
            './assets/fonts/figtree/Figtree-SemiBold.ttf',
            './assets/fonts/figtree/Figtree-SemiBoldItalic.ttf',
            './assets/fonts/parkinsans/Parkinsans-Light.ttf',
            './assets/fonts/parkinsans/Parkinsans-Regular.ttf',
            './assets/fonts/parkinsans/Parkinsans-Medium.ttf',
            './assets/fonts/parkinsans/Parkinsans-SemiBold.ttf',
            './assets/fonts/parkinsans/Parkinsans-Bold.ttf',
            './assets/fonts/parkinsans/Parkinsans-ExtraBold.ttf',
          ],
        },
        ios: {
          fonts: [
            './assets/fonts/figtree/Figtree-Black.ttf',
            './assets/fonts/figtree/Figtree-BlackItalic.ttf',
            './assets/fonts/figtree/Figtree-Bold.ttf',
            './assets/fonts/figtree/Figtree-BoldItalic.ttf',
            './assets/fonts/figtree/Figtree-ExtraBold.ttf',
            './assets/fonts/figtree/Figtree-ExtraBoldItalic.ttf',
            './assets/fonts/figtree/Figtree-Italic.ttf',
            './assets/fonts/figtree/Figtree-Light.ttf',
            './assets/fonts/figtree/Figtree-LightItalic.ttf',
            './assets/fonts/figtree/Figtree-Medium.ttf',
            './assets/fonts/figtree/Figtree-MediumItalic.ttf',
            './assets/fonts/figtree/Figtree-Regular.ttf',
            './assets/fonts/figtree/Figtree-SemiBold.ttf',
            './assets/fonts/figtree/Figtree-SemiBoldItalic.ttf',
            './assets/fonts/parkinsans/Parkinsans-Light.ttf',
            './assets/fonts/parkinsans/Parkinsans-Regular.ttf',
            './assets/fonts/parkinsans/Parkinsans-Medium.ttf',
            './assets/fonts/parkinsans/Parkinsans-SemiBold.ttf',
            './assets/fonts/parkinsans/Parkinsans-Bold.ttf',
            './assets/fonts/parkinsans/Parkinsans-ExtraBold.ttf',
          ],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '5cc33777-944c-42ef-b02a-996fe7f545ad',
    },
  },
  owner: 'zondax_ag',
})
