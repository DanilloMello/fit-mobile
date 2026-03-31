import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

// @react-native-google-signin/google-signin calls TurboModuleRegistry.getEnforcing()
// at module evaluation time, which throws in Expo Go (no native binary).
// Use require() so the crash is catchable and the app degrades gracefully.
let GoogleSignin: any = null;
let statusCodes: Record<string, string> = {};
try {
  const m = require('@react-native-google-signin/google-signin');
  GoogleSignin = m.GoogleSignin;
  statusCodes = m.statusCodes;
} catch {
  // Running in Expo Go — native module not available. Google Sign-In is disabled.
}

const isAvailable = GoogleSignin !== null;

export function useGoogleSignIn() {
  const { signInWithGoogle, isLoading: authLoading, error: authError } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!isAvailable) return;
    GoogleSignin.configure({
      // MUST be the Web Client ID. Do not use the Android Client ID here.
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
      offlineAccess: true,
    });
    setIsConfigured(true);
  }, []);

  const promptAsync = async () => {
    if (!isAvailable) return;
    try {
      setLocalLoading(true);

      // Check if the Android device has Google Play Services installed
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Trigger the native Android bottom-sheet prompt
      const userInfo = await GoogleSignin.signIn();

      // Safely extract the token (handles both older and newer v13+ versions of the library)
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        await signInWithGoogle(idToken);
      } else {
        throw new Error('No ID token returned from Google');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Google Play Services are not available on this device');
      } else {
        console.error('Google Sign-In Error:', error);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    promptAsync,
    isLoading: authLoading || localLoading,
    error: authError,
    // disabled when native module is unavailable (Expo Go) or not yet configured
    disabled: !isAvailable || !isConfigured,
  };
}
