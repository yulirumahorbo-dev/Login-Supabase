import * as Linking from "expo-linking";

const config = {
  screens: {
    AuthCallback: "auth-callback",
    Auth: "auth",
    Home: "home",
  },
};

const LinkingConfiguration = {
  prefixes: [
    Linking.createURL("/"), // untuk development
    "Login-Supabase://", // untuk Supabase redirect
  ],
  config,
};

export default LinkingConfiguration;
