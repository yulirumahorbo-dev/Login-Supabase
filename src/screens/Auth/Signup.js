import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { AuthContext } from "../../store/auth-context";

export default function Signup() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { signUp } = useContext(AuthContext);

  async function signupHandler({ name, email, password }) {
    setIsAuthenticating(true);
    try {
      const { user } = await signUp(name, email, password);

      if (user) {
        setIsAuthenticating(false);
      }
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
      setIsAuthenticating(false);
    }
  }

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
