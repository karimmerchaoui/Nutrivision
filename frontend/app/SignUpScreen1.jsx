import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Jost_800ExtraBold } from '@expo-google-fonts/jost/800ExtraBold';
import { useFonts } from '@expo-google-fonts/jost/useFonts';
const screenWidth = Dimensions.get("window").width;

export default function ProfileScreen() {
   let [fontsLoaded] = useFonts({
      Jost_800ExtraBold, 
    });
  const route = useRoute();
  const { basicData } = route.params || {};  
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
const navigation = useNavigation();
  

  const activityLevels = [
    "Sedentary (little or no exercise)",
    "Lightly active (light exercise 1-3 days/week)",
    "Moderately active (moderate exercise 3-5 days/week)",
    "Very active (hard exercise 6-7 days/week)",
    "Extremely active (very hard exercise & physical job)"
  ];

  const goals = [
    "Weight loss",
    "Maintain weight",
    "Muscle gain",
    "Improve fitness",
    "Prepare for competition"
  ];

  const handleGenderSelect = (selected) => {
    setGender(selected);
  };
  // inside ProfileStepOneScreen
const handleContinue = () => {
  if (!age || !weight || !height || !gender || !selectedActivity || !selectedGoal) {
    Alert.alert("Incomplete Form", "Please complete all the fields before continuing.");
    return;
  }
  const profileData = {
    age,
    weight,
    height,
    gender,
    activityLevel: selectedActivity,
    goal: selectedGoal,
  };

  const combinedData = {
    ...basicData,
    ...profileData,
  };

  navigation.navigate("SignUpScreen2", { userData: combinedData });
};


  return (
    <ImageBackground
      source={require('../assets/images/background_screen.png')}
      resizeMode="stretch"
      style={{ flex: 1 }}
      
    >
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Tell Us About You</Text>
        <Text style={styles.subheader}>
          We personalize based on your body & goals
        </Text>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Age</Text>
          <TextInput 
            style={styles.inputBox} 
            placeholder="23" 
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Weight (Kg)</Text>
          <TextInput 
            style={styles.inputBox} 
            placeholder="63" 
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Height (m)</Text>
          <TextInput 
            style={styles.inputBox} 
            placeholder="1.65" 
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.radioGroup}>
          {["Male", "Female"].map((option) => (
            <TouchableOpacity 
              key={option}
              style={styles.radioOption}
              onPress={() => handleGenderSelect(option)}
            >
              <View style={[
                styles.radioCircle,
                gender === option && styles.radioCircleSelected
              ]}>
                {gender === option && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Activity Level</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowActivityModal(true)}
        >
          <Text style={[
            styles.dropdownText,
            selectedActivity && { color: "#1C2220" }
          ]}>
            {selectedActivity || "Select your activity level"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Goal</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowGoalModal(true)}
        >
          <Text style={[
            styles.dropdownText,
            selectedGoal && { color: "#1C2220" }
          ]}>
            {selectedGoal || "Select your goal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>


        {/* Activity Level Modal */}
        <Modal
          visible={showActivityModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Activity Level</Text>
              {activityLevels.map((level) => (
                <Pressable
                  key={level}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedActivity(level);
                    setShowActivityModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{level}</Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalClose}
                onPress={() => setShowActivityModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Goal Modal */}
        <Modal
          visible={showGoalModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Your Goal</Text>
              {goals.map((goal) => (
                <Pressable
                  key={goal}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedGoal(goal);
                    setShowGoalModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{goal}</Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalClose}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    color: "#1C2220",
    marginBottom: 10,
    textAlign: "center",
    fontFamily:'Jost_800ExtraBold',
  },
  subheader: {
    fontSize: 16,
    color: "#43514C",
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
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C5C9C8",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C2220",
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "48%",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#697470",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#1C2220",
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1C2220",
  },
  radioLabel: {
    fontSize: 16,
    color: "#1C2220",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#C5C9C8",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: "#999999",
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
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C2220",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEEED",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#1C2220",
  },
  modalClose: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#2063EF",
    fontWeight: "bold",
  },
});