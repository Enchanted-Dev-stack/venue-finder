// app.config.js
import { ExpoConfig, ConfigContext } from 'expo/config';

// Read environment variables from .env files
require('dotenv').config();

export default ({ config }) => {
  return {
    ...config,
    // Your existing Expo config from app.json will be merged with this
    extra: {
      // Add your API keys here
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyBIXQAlqY90RD35r1Oltebzszf_bVQoijI",
      // Other environment variables...
    },
  };
};
