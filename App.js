import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screens
import Home from "./src/screens/Home";
import Login from "./src/screens/Auth/Login";
import Signup from "./src/screens/Auth/Signup";
import AuthContextProvider, { AuthContext } from "./src/store/auth-context";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";
import LoadingOverlay from "./src/components/UI/LoadingOverlay";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { session, isLoading, userProfile } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingOverlay message="Loading..." />;
  }

  return (
    <Stack.Navigator>
      {session && userProfile ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}
