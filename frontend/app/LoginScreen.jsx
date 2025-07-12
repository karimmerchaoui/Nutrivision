import React, { useContext, useState,useEffect  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from './store/userContext';
import { BASE_URL } from './config';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);
const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  const loadCredentials = async () => {
    const stored = await AsyncStorage.getItem('userCredentials');
    if (stored) {
      const { email, password } = JSON.parse(stored);
      setEmail(email);
      setPassword(password);
      setRememberMe(true);
    }
  };

  loadCredentials();
}, []);
const handleLogin = async () => {
  try {
    const userData = {
      email: email,
      password: password,
    };

    const res = await axios.post(`${BASE_URL}/login-user`, userData);
    if (res.status === 200) {
      setUser(res.data.user);

      // Save to storage if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('userCredentials', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('userCredentials');
      }

      navigation.navigate('HomeScreen');
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.subtitleText}>We're delighted to have you with us again.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                style={styles.inputField}
                placeholder="example@mail.com"
                placeholderTextColor="#C5C9C8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

        <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordInput}>
                <TextInput
					style={styles.passwordField}
					placeholder="Enter your password"
					placeholderTextColor="#C5C9C8"
					secureTextEntry={!showPassword} // <-- toggle visibility
					value={password}
					onChangeText={setPassword}
					/>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
					<Image
					source={{
						uri: showPassword
						? "https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png"
						: "https://img.icons8.com/fluency-systems-regular/48/000000/invisible.png" // pick from the table above
					}}
					style={styles.eyeIcon}
					/>
				</TouchableOpacity>
      </View>
            </View>

<View style={styles.optionsRow}>
  
  <BouncyCheckbox
    size={24}
    fillColor="#2063EF"
    unfillColor="#FFFFFF"
    text="Remember me"
    iconStyle={{ borderColor: "#697470", borderRadius: 6 }}
    innerIconStyle={{ borderWidth: 1,borderRadius:6 }}
    textStyle={{ textDecorationLine: "none" }}
    isChecked={rememberMe}
    disableBuiltInState
    onPress={() => setRememberMe(!rememberMe)}
  />
  <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
    <Text style={styles.forgotPassword}>Forgot your password?</Text>
  </TouchableOpacity>
</View>


            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't Have an Account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen0')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.decorativeCircle} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEEED",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: width * 0.08,
    paddingBottom: height * 0.05,
  },
  headerContainer: {
    marginBottom: height * 0.04,
  },
  welcomeText: {
    color: "#1C2220",
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  subtitleText: {
    color: "#1C2220",
    fontSize: width * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    color: "#1C2220",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  inputField: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C5C9C8",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#1C2220',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderColor: "#C5C9C8",
    borderRadius: 16,
    borderWidth: 1,
    paddingRight: width * 0.04,
  },
  passwordField: {
    flex: 1,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#1C2220',
  },
  eyeIcon: {
    width: width * 0.05,
    height: width * 0.05,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight:150,
    marginBottom: height * 0.025,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: width * 0.05,
    height: width * 0.05,
    borderColor: "#697470",
    borderRadius: 6,
    borderWidth: 1,
    marginRight: width * 0.02,
  },
  optionText: {
    color: "#1C2220",
    fontSize: width * 0.04,
  },
  forgotPassword: {
    color: "#2063EF",
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#1C2220",
    borderRadius: 16,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.03,
  },
  loginButtonText: {
    color: "#ECEEED",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: "#1C2220",
    fontSize: width * 0.04,
    marginRight: width * 0.01,
  },
  signupLink: {
    color: "#2063EF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  decorativeCircle: {
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: "#DA7658",
    borderRadius: width * 0.35,
    alignSelf: 'flex-end',
    marginTop: height * 0.05,
    marginRight: -width * 0.1,
    opacity: 0.8,
  },
  checkbox: {
  width: width * 0.05,
  height: width * 0.05,
  borderColor: "#697470",
  borderRadius: 6,
  borderWidth: 1,
  marginRight: width * 0.02,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},

innerCheck: {
  width: width * 0.025,
  height: width * 0.025,
  backgroundColor: '#fff',
  borderRadius: 3,
},
text5: {
		color: "#1C2220",
		fontSize: 16,
		marginRight: 43,
	},
	

});