import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authenticate: (token, user) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isLoading: true,
  });

  // 🔐 Simpan session ke AsyncStorage dan state
  function authenticate(token, user) {
    const session = { token, user };
    AsyncStorage.setItem("session", JSON.stringify(session));
    setAuthState({ ...session, isLoading: false });
  }

  // 🚪 Hapus session
  async function logout() {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("session");
    setAuthState({ token: null, user: null, isLoading: false });
  }

  // 🔁 Restore session dari Supabase dan/atau AsyncStorage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          authenticate(session.access_token, session.user);
        } else {
          const stored = await AsyncStorage.getItem("session");
          if (stored) {
            const parsed = JSON.parse(stored);
            setAuthState({ ...parsed, isLoading: false });
          } else {
            setAuthState({ token: null, user: null, isLoading: false });
          }
        }
      } catch (err) {
        console.log("Error restoring session:", err);
        setAuthState({ token: null, user: null, isLoading: false });
      }
    };

    restoreSession();
  }, []);

  // 🔁 Perbarui state jika Supabase session berubah
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          authenticate(session.access_token, session.user);
        } else {
          await AsyncStorage.removeItem("session");
          setAuthState({ token: null, user: null, isLoading: false });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    token: authState.token,
    user: authState.user,
    isAuthenticated: !!authState.token,
    isLoading: authState.isLoading,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
