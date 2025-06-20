import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import Input from "../UI/Input";
import InputSecure from "../UI/InputSecure";
import Button from "../UI/Button";
import FlatButton from "../UI/FlatButton";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// const data = [
//   "Apple",
//   "Banana",
//   "Orange",
//   "Grapes",
//   "Pineapple",
//   "Papaya",
//   "Peach",
// ];

export default function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [filteredName, setFilteredName] = useState([]);

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

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "name":
        setEnteredName(enteredValue);
        if (enteredValue) {
          const suggestions = users.filter((item) =>
            item.full_name.toLowerCase().startsWith(enteredValue.toLowerCase())
          );
          setFilteredName(suggestions);
        } else {
          setFilteredName([]);
        }
        break;
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function handleSelectItem(item) {
    setEnteredName(item);
    setFilteredName([]);
  }

  function submitHandler() {
    onAuthenticate({
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    });
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
      {!isLogin && (
        <>
          <Input
            label="Name"
            placeholder="Your Name"
            onUpdateValue={updateInputValueHandler.bind(this, "name")}
            value={enteredName}
          />

          {filteredName.length > 0 && (
            <FlatList
              data={filteredName}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelectItem(item.full_name)}>
                  <Text style={styles.suggestion}>{item.full_name}</Text>
                </Pressable>
              )}
            />
          )}
        </>
      )}
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

      <Button onPress={submitHandler}>{isLogin ? "Log In" : "Sign Up"}</Button>

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
