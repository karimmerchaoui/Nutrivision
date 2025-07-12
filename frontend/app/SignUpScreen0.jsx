// SignUpScreen1.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Jost_800ExtraBold } from '@expo-google-fonts/jost/800ExtraBold';
import { useFonts } from '@expo-google-fonts/jost/useFonts';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';

export default function SignUpScreen1() {
  const navigation = useNavigation();
 let [fontsLoaded] = useFonts({
    Jost_800ExtraBold, Jost_500Medium,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = () => {
    if (!name || !email || !phone || !password) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return;
  }

  // Phone number check: exactly 8 digits
  const phoneRegex = /^\d{8}$/;
  if (!phoneRegex.test(phone)) {
    Alert.alert("Invalid Phone", "Phone number must contain exactly 8 digits.");
    return;
  }

  // Password length check
  if (password.length < 8) {
    Alert.alert("Weak Password", "Password must be at least 8 characters long.");
    return;
  }
    const basicData = { name, email, phone, password };
    navigation.navigate("SignUpScreen1", { basicData });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background_screen.png")}
      resizeMode="stretch"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Create Your Account</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="you@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="55 345 678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.inputBox}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 27,
    fontFamily:'Jost_800ExtraBold',
    color: "#1C2220",
    marginBottom: 30,
    textAlign: "center",
  },
  inputRow: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#1C2220",
    marginBottom: 6,
    fontFamily:"Jost_500Medium",
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C5C9C8",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#1C2220",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily:'Jost_800ExtraBold',
  },
});
