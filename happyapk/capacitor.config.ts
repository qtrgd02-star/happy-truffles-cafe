import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.happytruffles.cafe',
  appName: 'Happy Truffles Cafe',
  webDir: 'dist',
  server: {
    url: 'https://happy-truffles-cafe-kwiev263s-dtwo1.vercel.app',
    cleartext: false
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#8B4513'
    },
    Network: {
      networkStatus: {
        connected: true,
        connectionType: 'wifi'
      }
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true
  }
};

export default config;