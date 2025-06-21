import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserProfile(userId) {
    console.log("Fetching profile for userId:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", userId)
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
      console.log("Loading session from AsyncStorage...");
      try {
        const sessionData = await AsyncStorage.getItem("supabaseSession");
        console.log("Raw sessionData:", sessionData);

        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          console.log("Parsed session:", parsedSession);

          const { data: restoredSession, error } =
            await supabase.auth.setSession(parsedSession);

          console.log("Restored session:", restoredSession, "Error:", error);

          if (error) {
            console.error("Failed to restore session:", error.message);
            setSession(null);
            setUserProfile(null);
          } else if (restoredSession?.session?.user?.id) {
            setSession(restoredSession.session);
            await fetchUserProfile(restoredSession.session.user.id);
          } else {
            setSession(null);
            setUserProfile(null);
          }
        } else {
          console.log("No session found in storage");
          setSession(null);
          setUserProfile(null);
        }
      } catch (e) {
        console.error("Error loading session", e);
        setSession(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    }
    loadSession();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session);
        if (session?.user) {
          await AsyncStorage.setItem(
            "supabaseSession",
            JSON.stringify(session)
          );
          setSession(session);
          await fetchUserProfile(session.user.id);
        } else {
          await AsyncStorage.removeItem("supabaseSession");
          setSession(null);
          setUserProfile(null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    console.log("Attempt login:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }
    const session = data.session;
    if (session) {
      await AsyncStorage.setItem("supabaseSession", JSON.stringify(session));
      setSession(session);
      await fetchUserProfile(session.user.id);
    }
    return data;
  }

  async function signUp(name, email, password) {
    console.log("Attempt signUp:", email);
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

    if (session) {
      await AsyncStorage.setItem("supabaseSession", JSON.stringify(session));
      setSession(session);
      await fetchUserProfile(user.id);
    }

    return { user };
  }

  async function logout() {
    console.log("Logging out");
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
