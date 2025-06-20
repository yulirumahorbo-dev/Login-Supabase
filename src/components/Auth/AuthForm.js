import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Input from "../UI/Input";
import InputSecure from "../UI/InputSecure";
import Button from "../UI/Button";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [users, setUsers] = useState([]);
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [filteredName, setFilteredName] = useState([]);

  const {
    name: nameIsInvalid,
    email: emailIsInvalid,
    password: passwordIsInvalid,
  } = credentialsInvalid;

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
    onSubmit({
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    });
  }

  return (
    <View>
      {!isLogin && (
        <>
          <Input
            label="Full Name"
            placeholder="Budi Santoso"
            onUpdateValue={updateInputValueHandler.bind(this, "name")}
            value={enteredName}
            isInvalid={nameIsInvalid}
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
        placeholder="budi@gmail.com"
        keyboardType="email-address"
        onUpdateValue={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
        isInvalid={emailIsInvalid}
      />

      <InputSecure
        label="Password"
        placeholder="******"
        onUpdateValue={updateInputValueHandler.bind(this, "password")}
        value={enteredPassword}
        isInvalid={passwordIsInvalid}
      />

      <Button onPress={submitHandler}>{isLogin ? "Log In" : "Sign Up"}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
