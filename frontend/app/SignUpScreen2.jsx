import React, { useState } from "react";
import axios from 'axios';
import { BASE_URL } from './config'; // Adjust the path as needed
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Jost_800ExtraBold } from '@expo-google-fonts/jost/800ExtraBold';
import { useFonts } from '@expo-google-fonts/jost/useFonts';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { Jost_400Regular_Italic } from '@expo-google-fonts/jost/400Regular_Italic';

export default function ProfileStepTwoScreen() {
   let [fontsLoaded] = useFonts({
      Jost_800ExtraBold,Jost_500Medium,Jost_400Regular_Italic,
    });
  
  const [showAllergies, setShowAllergies] = useState(false); // New state for toggle

  const navigation = useNavigation();
  const route = useRoute();
  const [healthConditions, setHealthConditions] = useState({});
  const [allergies, setAllergies] = useState({});
  const [otherAllergies, setOtherAllergies] = useState(false);
  const conditionOptions = [
    "Diabetes",
    "Kidney Disease",
    "Hypertension",
    "Iron Deficiency",
    "Obesity",
    "Heart Disease",
    "High Cholesterol",
  ];

  const allergyOptions = [
    "Peanuts",
    "Eggs",
    "Soy",
    "Milk",
    "Shellfish",
    "Sesame",
    "Wheat",
    "Others",
  ];

  const handleSubmit = () => {
    const selectedConditions = Object.keys(healthConditions).filter(
      (key) => healthConditions[key]
    );
    const selectedAllergies = Object.keys(allergies).filter(
      (key) => allergies[key]
    );

    
    const allUserData = {
      ...route.params?.userData,
      healthConditions: selectedConditions,
      allergies: [...selectedAllergies, otherAllergies].filter(Boolean),
    };
    
    axios
      .post(`${BASE_URL}/register`, allUserData)
      .then(res => {
        if (res.status === 200) {
          Alert.alert('Success', 'Account created successfully');
          navigation.navigate("LoginScreen");
        } else {
          Alert.alert('Error', res.data?.data || 'Something went wrong');
        }
      })
      .catch(e => {
        console.error(e);
        Alert.alert('Error', 'Failed to connect to server');
      });
    Alert.alert("Profile Complete", "Your profile has been saved!");
  };

  const toggleHealthCondition = (condition) => {
    setHealthConditions((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  const toggleAllergy = (allergy) => {
    setAllergies((prev) => ({
      ...prev,
      [allergy]: !prev[allergy],
    }));
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inner}>
          <Text style={styles.title}>Do you have any health conditions?</Text>
          <Text style={styles.subtitle}>
            We use this to check if certain foods are suitable for you.
          </Text>

          {/* Health Conditions - 2 Column Grid */}
          <View style={styles.gridContainer}>
            {conditionOptions.map((condition) => (
              <View style={styles.gridItem} key={condition}>
                <BouncyCheckbox
                  isChecked={healthConditions[condition] || false}
                  size={20}
                  fillColor="#9BB9AF"
                  unfillColor="#ECEEED"
                  iconStyle={{
                    borderColor: "#ECEEED",
                    borderRadius: 6, 
                    
                  }}
                  innerIconStyle={{
                    borderWidth: 2,
                    borderRadius: 6, 
                  }}
                  onPress={() => toggleHealthCondition(condition)}
                />
                <Text style={styles.checkboxLabel}>{condition}</Text>
              </View>
            ))}
            <View style={styles.gridItem}>
            <BouncyCheckbox
              isChecked={showAllergies}
              size={20}
              fillColor="#9BB9AF"
              unfillColor="#ECEEED"
              iconStyle={{
                borderColor: "#ECEEED",
                borderRadius: 6,
              }}
              innerIconStyle={{
                borderWidth: 2,
                borderRadius: 6,
              }}
              onPress={() => setShowAllergies(!showAllergies)}
            />
            <Text style={styles.checkboxLabel}>I have food allergies</Text>
          </View>
          </View>

          {/* Allergy Toggle Button */}
          

          {/* Conditionally Rendered Allergy List */}
          {showAllergies && (
            <>
              <Text style={styles.subtitle}>Allergy List</Text>
              <View style={styles.gridContainer}>
                {allergyOptions.map((allergy) => (
                  <View style={styles.gridItem} key={allergy}>
                    <BouncyCheckbox
                      isChecked={false}
                size={20}
                fillColor="#9BB9AF"
                unfillColor="#ECEEED"
                iconStyle={{
                  borderColor: "#ECEEED",
                  borderRadius: 2,
                }}
                innerIconStyle={{
                  borderWidth: 2,
                  borderRadius: 2,
                }}
                      onPress={() => toggleAllergy(allergy)}
                    />
                    <Text style={styles.checkboxLabel}>{allergy}</Text>
                  </View>
                ))}
              </View>

              {/* Other allergies input */}
              {allergies["Others"] && (
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Please specify:</Text>
                  <TextInput
                    placeholder="What other allergies do you have?"
                    value={otherAllergies}
                    onChangeText={setOtherAllergies}
                    style={styles.textInput}
                    placeholderTextColor="#999"
                  />
                </View>
              )}
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  inner: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily:"Jost_800ExtraBold",
    color: "#1C2220",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#43514C",
    marginBottom: 16,
    fontFamily:"Jost_500Medium",
    
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },


  gridItem: {
    width: '40%', // Slightly less than half to account for spacing
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#1C2220",
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    color: "#1C2220",
    marginLeft: 10,
    flexShrink: 1,
  },
  inputBox: {
    marginTop: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1C2220",
    marginBottom: 6,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 0,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
   checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 0, // Ensure no horizontal padding
  },
  checkbox: {
    marginRight: 8, // Reduced from 10
    marginLeft: 0,   // Explicitly set to 0
    padding: 0,      // Remove any internal padding
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1C2220",
    marginLeft: -110,    // Consistent spacing
    fontFamily:"Jost_400Regular_Italic",
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
    color: "#fff",
    fontSize: 17,
    fontFamily:"Jost_800ExtraBold",
  },
});
