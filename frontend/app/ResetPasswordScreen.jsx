import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Dimensions } from 'react-native';
import axios from 'axios';
import { BASE_URL } from './config';

const { width, height } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestReset = async () => {
    if (!email) return Alert.alert('Error', 'Email is required');
    try {
      const res = await axios.post(`${BASE_URL}/request-password-reset`, { email });
      if (res.data.status === 'ok') {
        Alert.alert('Success', 'Reset email sent. Check your inbox.');
        setStep(2);
      } else {
        Alert.alert('Error', res.data.message || 'Something went wrong');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to send reset email');
    }
  };

  const handleResetPassword = async () => {
    
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    try {
      const res = await axios.post(`${BASE_URL}/reset-password`, {
        email,
        token,
        newPassword,
      });
      if (res.data.status === 'ok') {
        Alert.alert('Success', 'Password reset successfully');
      } else {
        Alert.alert('Error', res.data.message || 'Failed to reset password');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Reset failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {step === 2 && (
        <>
          <TextInput
            placeholder="Reset Token"
            style={styles.input}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="New Password"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm New Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={step === 1 ? handleRequestReset : handleResetPassword}
      >
        <Text style={styles.buttonText}>{step === 1 ? 'Send Reset Email' : 'Reset Password'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ebeded',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C5C9C8",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#1C2220',
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    marginHorizontal:5,
    color: "#000",
    fontSize: 22,
    fontFamily:'Jost_800ExtraBold',
    marginBottom: 10,
  },
});
