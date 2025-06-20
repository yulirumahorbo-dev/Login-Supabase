import React, { useState } from "react";
import { signIn } from "../lib/auth";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/UI/LoadingOverlay";

export default function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [message, setMessage] = useState("");

  async function signInHandler({ email, password }) {
    setIsAuthenticating(true);
    const { error } = await signIn(email, password);
    if (!error) {
      setIsAuthenticating(false);
    } else {
      setMessage(error.message);
      console.log("Sign In Error:", message);
      Alert.alert(
        "Sign In failed",
        "Please check your credentials or try again later."
      );
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Signing you in..." />;
  }

  return <AuthContent isSignIn onAuthenticate={signInHandler} />;
}
