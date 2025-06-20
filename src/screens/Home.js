// screens/HomeScreen.js
import { View, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import Button from "../components/UI/Button";

export default function Home({ navigation }) {
  async function onSubmit() {
    await supabase.auth.signOut();
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Button onPress={onSubmit}>Logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 20, marginBottom: 20 },
});
