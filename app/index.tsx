import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../styles";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (name: string) => {
    setUserName(name);
  };

  const handleLogin = () => {
    if (userName) {
      const userId = uuidv4();
      router.push({ pathname: "/chat", params: { userName, userId } });
    }
    setError("Please choose a name to proceed");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TextInput
        style={styles.input}
        placeholder="What's your name?"
        onChangeText={handleChange}
        placeholderTextColor="#fff"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enter chat</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purpleLight,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.purpleMediumLight,
    color: colors.white,
    borderRadius: 8,
    width: "70%",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.purpleDark,
    borderRadius: 8,
    width: "70%",
    marginBottom: 16,
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
  },
});
