import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screens
import Home from "./src/screens/Home";
import Login from "./src/screens/Auth/Login";
import Signup from "./src/screens/Auth/Signup";
import AuthContextProvider, { AuthContext } from "./src/store/auth-context";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { session } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {session ? (
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
