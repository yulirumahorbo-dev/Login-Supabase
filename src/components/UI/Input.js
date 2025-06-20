import { StyleSheet, Text, View, TextInput } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function Input({
  label,
  placeholder,
  keyboardType,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.formContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>

      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onChangeText={onUpdateValue}
        value={value}
      />
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
  input: {
    padding: 12,
    backgroundColor: GlobalStyles.colors.primary0,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary800,
    borderRadius: 8,
    fontSize: 16,
  },
  inputInvalid: {
    borderColor: GlobalStyles.colors.error500,
    backgroundColor: GlobalStyles.colors.error500,
  },
});
