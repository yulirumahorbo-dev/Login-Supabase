import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { AuthContext } from "../../store/auth-context";

export default function Login() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { user } = await login(email, password);

      if (user) {
        setIsAuthenticating(false);
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      setIsAuthenticating(false);
    }
  }

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
