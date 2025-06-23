import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserProfile(id) {
    console.log("Fetching profile for userId:", id);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch profile error:", error.message);
      setUserProfile(null);
      return null;
    } else {
      console.log("Profile data:", data);
      setUserProfile(data);
      return data;
    }
  }

  useEffect(() => {
    async function loadSession() {
      setIsLoading(true);
      try {
        const stored = await AsyncStorage.getItem("supabaseSession");
        if (stored) {
          const { access_token, refresh_token } = JSON.parse(stored);
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.log("Session restore error:", error.message);
            return;
          }

          const restoredSession = data?.session;
          console.log("Restored session:", restoredSession);
          setSession(restoredSession);

          const { data: userData, error: userError } =
            await supabase.auth.getUser();
          if (userData?.user?.id) {
            console.log("Fetching profile for user id:", userData.user.id);
            await fetchUserProfile(userData.user.id);
          } else {
            console.warn("No user after session restore", userError);
          }
        }
      } catch (err) {
        console.error("loadSession error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, sessionData) => {
        const session = sessionData?.session;
        console.log("Auth state changed:", _event, session);

        if (session?.access_token && session?.refresh_token) {
          const payload = {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          };
          await AsyncStorage.setItem(
            "supabaseSession",
            JSON.stringify(payload)
          );
          setSession(session);

          const userId = session.user?.id;
          if (userId) {
            await fetchUserProfile(userId);
          } else {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user?.id) {
              await fetchUserProfile(userData.user.id);
            }
          }
        } else {
          await AsyncStorage.removeItem("supabaseSession");
          setSession(null);
          setUserProfile(null);
        }
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }

    const session = data.session;
    const user = session?.user;

    if (session?.access_token && session?.refresh_token) {
      const payload = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      };
      await AsyncStorage.setItem("supabaseSession", JSON.stringify(payload));
      setSession(session);
      if (user) await fetchUserProfile(user.id);
    }

    return data;
  }

  async function signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("SignUp error:", error.message);
      throw error;
    }

    const user = data?.user;
    const session = data?.session;

    if (!user) {
      console.warn("User is null");
      return { user: null };
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert([{ id: user.id, email, name }]);

    if (upsertError) {
      console.error("Profile upsert error:", upsertError.message);
    }

    if (session?.access_token && session?.refresh_token) {
      const payload = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      };
      await AsyncStorage.setItem("supabaseSession", JSON.stringify(payload));
      setSession(session);
      await fetchUserProfile(user.id);
    }

    return { user };
  }

  async function logout() {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("supabaseSession");
    setSession(null);
    setUserProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ session, userProfile, isLoading, login, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
