import { useContext, useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../store/auth-context";
Butto;
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";

const schema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

export default function AuthContent({ isLogin }) {
  const [submitError, setSubmitError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // 👈

  const { authenticate } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setSubmitError(null);
    try {
      let response = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      const { data, error } = response;

      if (error) return setSubmitError(error.message);

      if (data.session) {
        authenticate(data.session);
      } else {
        alert("✅ Cek email untuk verifikasi akun.");
        reset();
      }
    } catch (err) {
      console.log(err);
      setSubmitError("❌ Terjadi kesalahan saat proses login/signup");
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, { flex: 1, borderRightWidth: 0 }]}
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {passwordVisible ? (
          <IconButton
            style={{ marginLeft: 16 }}
            onPress={() => setPasswordVisible((prev) => !prev)}
            icon="eye-off-outline"
            color={GlobalStyles.colors.primary800}
            size={32}
          />
        ) : (
          <IconButton
            style={{ marginLeft: 16 }}
            onPress={() => setPasswordVisible((prev) => !prev)}
            icon="eye-outline"
            color={GlobalStyles.colors.primary800}
            size={32}
          />
        )}
      </View>
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {submitError && <Text style={styles.error}>{submitError}</Text>}

      <Button title={isLogin ? "Login" : "Sign Up"} onPress={handleSubmit} />

      <Text
        style={styles.toggle}
        onPress={() => {
          setIsLogin((prev) => !prev);
          reset();
          setSubmitError(null);
        }}
      >
        {isLogin
          ? "Belum punya akun? Daftar di sini"
          : "Sudah punya akun? Login di sini"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  toggle: {
    color: "blue",
    marginTop: 16,
    textAlign: "center",
  },
});
