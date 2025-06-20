import { Alert, StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import FlatButton from "../UI/FlatButton";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { supabase } from "../../lib/supabase";

export default function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name");

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setUsers(data);
      }
    }
    fetchUsers();
  }, []);

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    name: false,
    email: false,
    password: false,
  });

  function submitHandler(credentials) {
    let { name, email, password } = credentials;

    name = name.trim();
    email = email.trim();
    password = password.trim();

    const nameIsValid = users.some((item) => item.full_name === name);
    const emailIsValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !nameIsValid)) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        name: !nameIsValid,
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ name, email, password });
  }

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />

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
  authContent: {
    marginTop: 64,
    padding: 16,
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.primary0,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  suggestion: {
    padding: 10,
    backgroundColor: GlobalStyles.colors.primary50,
    marginVertical: 2,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  buttons: {
    marginTop: 8,
  },
});
