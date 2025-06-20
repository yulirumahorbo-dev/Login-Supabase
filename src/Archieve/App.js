import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider, { AuthContext } from "./src/store/auth-context";
import { useContext } from "react";
import Home from "./src/screens/Home";
import AuthScreen from "./src/screens/Auth/AuthScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import AuthCallbackScreen from "./src/screens/Auth/UI/AuthCallbackScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  return (
    <Stack.Navigator>
      {!token && (
        <Stack.Screen
          name="AuthCallback"
          component={AuthCallbackScreen}
          options={{ headerShown: false }}
        />
      )}
      {token ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer linking={LinkingConfiguration}>
        <AppNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}
