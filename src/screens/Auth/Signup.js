import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { GlobalStyles } from "../../constants/styles";
import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";

export default function Signup({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signupHandler = async ({
    email = enteredEmail,
    password = enteredPassword,
  }) => {
    setIsAuthenticating(true);
    try {
      let response = await supabase.auth.signUp({ email, password });

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

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <AuthContent onAuthenticate={signupHandler} />
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
    marginTop: 24,
  },
});
