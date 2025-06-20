import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { GlobalStyles } from "../../constants/styles";
import Input from "./UI/Input";
import InputSecure from "./UI/InputSecure";
import Button from "./UI/Button";
import FlatButton from "./UI/FlatButton";
import LoadingOverlay from "./UI/LoadingOverlay";

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  const onSubmit = async ({
    email = enteredEmail,
    password = enteredPassword,
  }) => {
    setIsAuthenticating(true);
    try {
      let response = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      const { data } = response;

      console.log(data);
      console.log(data.user.email);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authetication failed!",
        "Could not create user, please check your input and try again later."
      );
      setIsAuthenticating(false);
    }
  };

  function switchAuthModeHandler() {
    setIsLogin((prev) => !prev);
    setSubmitError(null);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

      <Input
        label="Email Address"
        placeholder="youremail@gmail.com"
        keyboardType="email-address"
        onUpdateValue={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
      />

      <InputSecure
        label="Password"
        placeholder="******"
        onUpdateValue={updateInputValueHandler.bind(this, "password")}
        value={enteredPassword}
      />

      <Button onPress={onSubmit}>{isLogin ? "Log In" : "Sign Up"}</Button>

      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin
            ? "Don't have an account? Sign up here"
            : "Already have an account? Log in here"}
        </FlatButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.primary0,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  buttons: {
    marginTop: 8,
  },
});
