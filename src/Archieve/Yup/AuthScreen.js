import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../store/auth-context";
import { GlobalStyles } from "../../constants/styles";
import Input from "./UI/Input";
import InputSecure from "./UI/InputSecure";
import Button from "./UI/Button";
import FlatButton from "./UI/FlatButton";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  const { authenticate } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setSubmitError(null);
    try {
      const response = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      const { data, error } = response;

      if (error) {
        if (error.message.includes("invalid email")) {
          Alert.alert("Email tidak valid.");
        } else if (error.message.includes("User already registered")) {
          Alert.alert("Email sudah terdaftar.");
        } else {
          Alert.alert("Error", error.message);
        }
        return;
      }

      if (data.session) {
        const { access_token, user } = data.session;
        authenticate(access_token, user);
        reset();
      } else {
        Alert.alert("Cek email untuk verifikasi akun.");
        reset();
      }
    } catch (err) {
      console.log(err);
      setSubmitError("Terjadi kesalahan saat proses login/signup");
    }
  };

  function switchAuthModeHandler() {
    setIsLogin((prev) => !prev);
    reset();
    setSubmitError(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email Address"
            placeholder="youremail@gmail.com"
            keyboardType="email-address"
            onUpdateValue={onChange}
            value={value}
          />
        )}
      />

      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <InputSecure
            label="Password"
            placeholder="******"
            onUpdateValue={onChange}
            value={value}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {submitError && <Text style={styles.error}>{submitError}</Text>}

      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isLogin ? "Log In" : "Sign Up"}
      </Button>

      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin
            ? "Don't have an account? Sign up here"
            : "Already have an account? Log in here"}
        </FlatButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.primary0,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  buttons: {
    marginTop: 8,
  },
});
