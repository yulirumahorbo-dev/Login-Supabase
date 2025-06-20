import { useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../../lib/supabase";
import { AuthContext } from "../../../store/auth-context";

export default function AuthCallbackScreen() {
  const { authenticate } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    async function handleRedirect() {
      const url = await Linking.getInitialURL();
      if (url) {
        const { data, error } = await supabase.auth.getSessionFromUrl({ url });
        if (error) {
          console.error("Redirect error:", error.message);
        } else if (data.session) {
          authenticate(data.session);
          navigation.replace("Home");
        }
      }
    }

    handleRedirect();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Memverifikasi akun Anda...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 12, fontSize: 16 },
});
