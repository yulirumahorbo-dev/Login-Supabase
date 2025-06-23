// screens/HomeScreen.js
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { supabase } from "../lib/supabase";
import Button from "../components/UI/Button";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";

export default function Home() {
  const { userProfile, isLoading, logout } = useContext(AuthContext);

  if (isLoading || !userProfile) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {userProfile.name || "User"}!</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 20, marginBottom: 20 },
});
