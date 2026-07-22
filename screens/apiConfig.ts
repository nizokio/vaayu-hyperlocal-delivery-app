import { Platform } from 'react-native';

// Central API configuration for Vaayu Backend.
// For testing on real physical devices via Expo Go, replace this with your computer's local network IP address (e.g., '192.168.1.x').
const DEV_LAN_IP = '192.168.1.100';

export const BACKEND_URL = Platform.select({
  ios: `http://localhost:3000`,
  android: `http://10.0.2.2:3000`, // Android emulator loops back to machine via 10.0.2.2
  default: `http://localhost:3000`,
});

// To toggle testing on real device, uncomment the line below:
// export const BACKEND_URL = `http://${DEV_LAN_IP}:3000`;

console.log(`[API] Configuring base server URL to: ${BACKEND_URL}`);
