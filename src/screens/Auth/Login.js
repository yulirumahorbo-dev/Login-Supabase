import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { GlobalStyles } from "../../constants/styles";
import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { AuthContext } from "../../store/auth-context";

export default function Login({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { user } = await login(email, password);

      if (user) {
        setIsAuthenticating(false);
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      setIsAuthenticating(false);
    }
  }
  // const loginHandler = async ({ email, password }) => {
  //   setIsAuthenticating(true);
  //   try {
  //     let response = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });

  //     const { data } = response;

  //     console.log(data);
  //     console.log(data.user.email);
  //     navigation.navigate("Home");
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert(
  //       "Authetication failed!",
  //       "Could not log you in. Please check your credentials or try again later!"
  //     );
  //     setIsAuthenticating(false);
  //   }
  // };

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <AuthContent isLogin onAuthenticate={loginHandler} />
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
