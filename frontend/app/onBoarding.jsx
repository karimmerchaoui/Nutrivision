import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const screens = [
  {
    title: "Eat Smart,\nthe North African Way",
    subtitle: "Personalized insights. Calorie tracking. Food compatibility made easy.",
    image: require("../assets/images/Asset 1.png"),
    background: require("../assets/images/onboarding1.png"),
  },
  {
    title: "Smart Calorie Tracking",
    subtitle: "Track calories accurately from North African meals like couscous, loubia, and brik - no guesswork needed.",
    image: require("../assets/images/Asset 1.png"),
    background: require("../assets/images/onboarding2.png"),
  },
  {
    title: "Personalized Food Suitability",
    subtitle: "We analyze your health profile and tell you if a food suits your needs - like low sugar, no red meat, or gluten-free.",
    image: require("../assets/images/Asset 1.png"),
    background: require("../assets/images/onboarding3.png"),
  },{
    title: "Eat Smart, the North African Way",
    subtitle: "Personalized insights. Calorie tracking. Food compatibility made easy.",
    image: require("../assets/images/Asset 1.png"),
    background: require("../assets/images/background_screen1.png"),
  }
];

export default function Onboarding() {
  const [screenIndex, setScreenIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const nextScreen = () => {
    if (screenIndex === screens.length - 1) {
      navigation.replace("SignUpScreen0");
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      setScreenIndex((prev) => prev + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });
  };

  const { title, subtitle, image, background } = screens[screenIndex];

  return (
    <ImageBackground source={background} resizeMode="stretch" style={styles.background}>
      <SafeAreaView style={styles.container}>
  <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
    <Image source={image} style={styles.image} resizeMode="contain" />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </Animated.View>

  <View style={styles.footer}>
    <TouchableOpacity style={styles.button} onPress={nextScreen}>
      <Text style={styles.buttonText}>
        {screenIndex === screens.length - 1 ? "Get Started" : "Next"}
      </Text>
    </TouchableOpacity>

    {screenIndex === screens.length - 1 && (
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    )}
  </View>
</SafeAreaView>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1C2220",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#F0F0F0",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#1C2220AA", // semi-transparent
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 110,
    textAlign: "right",

  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  footer: {
  alignItems: "center",
  marginBottom: 60,
},
loginText: {
  color: "#1C2220",
  fontSize: 16,
  marginTop: 15,
  textAlign: "center",
},
loginLink: {
    color: "#2063EF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});
