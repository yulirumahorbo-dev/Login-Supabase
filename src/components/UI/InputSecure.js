import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function InputSecure({
  label,
  placeholder,
  keyboardType,
  onUpdateValue,
  value,
  secure,
  onPress,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onChangeText={onUpdateValue}
          value={value}
          secureTextEntry={!passwordVisible}
        />
        <Pressable
          onPress={() => setPasswordVisible((prev) => !prev)}
          style={({ pressed }) => [
            styles.toggleButton,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          {passwordVisible ? (
            <Ionicons
              name="eye-outline"
              size={24}
              color={GlobalStyles.colors.gray500}
            />
          ) : (
            <Ionicons
              name="eye-off-outline"
              size={24}
              color={GlobalStyles.colors.gray500}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginVertical: 8,
  },
  label: {
    color: GlobalStyles.colors.primary800,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary800,
    borderRadius: 8,
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: GlobalStyles.colors.primary0,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
