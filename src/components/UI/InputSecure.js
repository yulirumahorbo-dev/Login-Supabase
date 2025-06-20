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
  isInvalid,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={styles.formContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          isInvalid && styles.inputContainerInvalid,
        ]}
      >
        <TextInput
          style={[styles.input, isInvalid && styles.inputInvalid]}
          placeholder={placeholder}
          placeholderTextColor={GlobalStyles.colors.gray100}
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
            isInvalid && styles.toggleButtonInvalid,
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
  labelInvalid: {
    color: GlobalStyles.colors.error500,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary800,
    borderRadius: 8,
    fontSize: 16,
  },
  inputContainerInvalid: {
    borderColor: GlobalStyles.colors.error500,
    backgroundColor: GlobalStyles.colors.error50,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: GlobalStyles.colors.primary0,
  },
  inputInvalid: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  toggleButton: {
    marginHorizontal: 12,
    marginVertical: 10,
  },
  toggleButtonInvalid: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
