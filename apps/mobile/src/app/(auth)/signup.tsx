import { Redirect } from 'expo-router';

// Sign-in and sign-up are now unified in a single adaptive screen.
export default function SignUpScreen() {
  return <Redirect href="/(auth)/signin" />;
}
