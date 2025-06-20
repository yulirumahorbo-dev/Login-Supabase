import React, { useState } from "react";
import { signUp } from "../lib/auth";
import AuthContent from "../components/Auth/AuthContent";
import { StyleSheet, Text } from "react-native";
import { AuthContext } from "../store/auth-context";

export default function SignUp() {
  const [message, setMessage] = useState("");
  const authCtx = useContext(AuthContext);

  async function signUpHandler({ name, email, password }) {
    const { error } = await signUp(email, password);
    if (error) setMessage(error.message);
    else setMessage("Check your email for confirmation.");
  }

  return (
    <>
      <AuthContent onAuthenticate={signUpHandler} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 16, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  message: { marginTop: 10, color: "red", textAlign: "center" },
});
