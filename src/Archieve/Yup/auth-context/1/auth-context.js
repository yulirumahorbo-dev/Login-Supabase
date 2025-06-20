import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authenticate: (token, user) => {},
  setUserData: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserDataState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function authenticate(token, userData) {
    setAuthToken(token);
    setUserDataState(userData);

    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log("Stored token and userData successfully");
    } catch (error) {
      console.log("Failed to store auth data", error);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setAuthToken(null);
    setUserDataState(null);

    try {
      await AsyncStorage.multiRemove(["token", "userData"]);
      console.log("✅ Cleared auth storage on logout");
    } catch (error) {
      console.log("❌ Failed to clear auth storage on logout", error);
    }
  }

  const value = {
    token: authToken,
    userData: userData,
    setUserData: setUserData,
    isAuthenticated: !!authToken,
    isLoading: isLoading,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
