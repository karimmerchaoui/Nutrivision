import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Image,Dimensions,Alert } from 'react-native';
import { UserContext } from './store/userContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { healthConditions, commonAllergies } from './constants';
import axios from 'axios';
import { BASE_URL } from './config';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Jost_800ExtraBold_Italic } from '@expo-google-fonts/jost/800ExtraBold_Italic';
import { Jost_700Bold_Italic } from '@expo-google-fonts/jost/700Bold_Italic';
import { Jost_200ExtraLight } from '@expo-google-fonts/jost/200ExtraLight';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { useFonts } from '@expo-google-fonts/jost/useFonts';
import { Jost_200ExtraLight_Italic } from '@expo-google-fonts/jost/200ExtraLight_Italic';

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  let [fontsLoaded] = useFonts({
          Jost_800ExtraBold_Italic,Jost_700Bold_Italic, Jost_200ExtraLight,Jost_500Medium,Jost_200ExtraLight_Italic
        });
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [allergyModalVisible, setAllergyModalVisible] = useState(false);
  
  const handleSave = async () => {
    try {
      
      const response = await axios.put(`${BASE_URL}/update-user/${editedUser.email}`, editedUser);
      
      if (response.data.status === 'ok') {
        setUser(editedUser);

        Alert.alert(
  "User updated successfully",
  "",
  [
    {
      text: "Return to Home",
      onPress: () => navigation.navigate('HomeScreen') // Add this line
    },
    {
      text: "OK"
    }
  ]
);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No user data found. Please log in.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>

      <View style={styles.profileImageContainer}>
        <Image source={require('../assets/images/avatar.png')} style={styles.profileImage} />
      </View>

      {/* Profile Image with Edit Icon */}
    <View style={styles.sectionRow}>
  <Text style={styles.sectionTitle}>Personal Information</Text>
  <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
    <Image source={require('../assets/images/pencil.png')} style={styles.pencilIcon} />
  </TouchableOpacity>
</View>


      {/* Fields */}
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Name</Text>
        <TextInput editable={false} style={styles.valueInput} value={user.name} />
          </View>
          
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Email address</Text>
            <TextInput editable={false} style={styles.valueInput} value={user.email} />
          </View>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput editable={false} style={styles.valueInput} value={user.mobile} />
          </View>

      {/* Health Conditions */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Health Conditions</Text>
        <TouchableOpacity onPress={() => setHealthModalVisible(true)}>
          <Image source={require('../assets/images/pencil.png')} style={styles.pencilIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.conditionsGrid}>
        {user.healthConditions?.map((cond, index) => (
          <View key={index} style={styles.conditionItem}>
            <Text style={styles.bullet}>• {cond}</Text>
          </View>
        ))}
      </View>

      {/* Allergies */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Allergies</Text>
        <TouchableOpacity onPress={() => setAllergyModalVisible(true)}>
          <Image source={require('../assets/images/pencil.png')} style={styles.pencilIcon} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.conditionsGrid}>
        {user.allergies?.map((item, index) => (
          <View key={index} style={styles.conditionItem}>
            <Text style={styles.bullet}>• {item}</Text>
          </View>
        ))}
      </View>

      {/* Modal for Health/Allergy editing */}
      <Modal visible={infoModalVisible} animationType="slide">
  <ScrollView contentContainerStyle={styles.modalContainer}>
    <Text style={styles.modalTitle}>Edit Personal Info</Text>

    <Text style={styles.label}>Name</Text>
    <TextInput
      style={styles.valueInput}
      value={editedUser.name}
      onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
    />


    <Text style={styles.label}>Email</Text>
    <TextInput
      style={styles.valueInput}
      value={editedUser.email}
      onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <Text style={styles.label}>Mobile</Text>
    <TextInput
      style={styles.valueInput}
      value={editedUser.mobile}
      onChangeText={(text) => setEditedUser({ ...editedUser, mobile: text })}
      keyboardType="phone-pad"
    />

    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalButton}>
        <Text>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSave();
          setInfoModalVisible(false);
        }}
        style={styles.modalButton}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
</Modal>
  <Modal visible={healthModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Health Conditions</Text>
          
          <View style={styles.twoColumnGrid}>
            {healthConditions.map((condition) => (
              <View key={condition.id} style={styles.checkboxItem}>
                <BouncyCheckbox
                  size={25}
                  fillColor="#9BB9AF"
                  unfillColor="#ECEEED"
                  text={condition.label}
                  iconStyle={{
                    borderColor: "#ECEEED",
                    borderRadius: 6, 
                    
                  }}
                  innerIconStyle={{
                    borderWidth: 2,
                    borderRadius: 6, 
                  }}
                  textStyle={{ textDecorationLine: "none" }}
                  isChecked={editedUser.healthConditions?.includes(condition.id)}
                  onPress={(isChecked) => {
                    const current = editedUser.healthConditions || [];
                    const updated = isChecked
                      ? [...current, condition.id]
                      : current.filter(c => c !== condition.id);
                    setEditedUser({ ...editedUser, healthConditions: updated });
                  }}
                />
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setHealthModalVisible(false)} style={styles.modalButton}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal visible={allergyModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Allergies</Text>
          
          <View style={styles.twoColumnGrid}>
            {commonAllergies.map((allergy) => (
              <View key={allergy.id} style={styles.checkboxItem}>
                <BouncyCheckbox
                  size={25}
                  fillColor="#9BB9AF"
                  unfillColor="#ECEEED"
                  text={allergy.label}
                  iconStyle={{
                    borderColor: "#ECEEED",
                    borderRadius: 6, 
                    
                  }}
                  innerIconStyle={{
                    borderWidth: 2,
                    borderRadius: 6, 
                  }}
                  textStyle={{ textDecorationLine: "none" }}
                  isChecked={editedUser.allergies?.includes(allergy.id)}
                  onPress={(isChecked) => {
                    const current = editedUser.allergies || [];
                    const updated = isChecked
                      ? [...current, allergy.id]
                      : current.filter(a => a !== allergy.id);
                    setEditedUser({ ...editedUser, allergies: updated });
                  }}
                />
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setAllergyModalVisible(false)} style={styles.modalButton}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      
    </ScrollView>
    <View style={styles.tabBar}>
            {/* First Tab (Home) */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <Ionicons name="home-outline" size={24}/>
            </TouchableOpacity>
      
            {/* Center FAB */}
            <TouchableOpacity
              style={styles.fab}
              onPress={() => nav.navigate('CameraScreen')}
            >
              {/* Replace with your logo/icon */}
              <Image
          source={require('../assets/images/Scan.png')} // Adjust the path as needed
          style={{ width: 69, height: 69 }}
        />
            </TouchableOpacity>
      
            {/* Second Tab (Profile) */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => navigation.navigate('ProfileScreen')}
            >
              <Ionicons name="person-outline" size={24}/>
            </TouchableOpacity>
        </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconCircle: {
    position: 'absolute',
    right: 110,
    top: 100,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
  },
  pencilIcon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
    fontFamily:'Jost_500Medium',
  },
  valueInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldBlock: {
    flex: 1,
    marginRight: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily:'Jost_800ExtraBold_Italic',
  },
  bullet: {
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 5,
    fontFamily:'Jost_500Medium',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily:'Jost_800ExtraBold_Italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#333',
  },
  checkmark: {
    fontSize: 16,
    color: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily:'Jost_500Medium'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  modalButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
  },
  sectionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 10,
  justifyContent: 'flex-start', // change from 'space-between'
},
pencilIcon: {
  width: 30,
  height: 30,
  marginLeft: 8, // add some space between title and pencil
},
grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
checkboxContainer: {
  width: '48%',
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 6,
},
conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionItem: {
    width: '48%', // leaves a small gap between columns
    marginBottom: 8,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxItem: {
    width: '48%',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'center', // Changed from 'space-between'
    alignItems: 'center',
    paddingHorizontal: 0, // Changed from 40
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
},
tab: {
    width: width / 3, // Each tab takes equal width
    alignItems: 'center',
},
fab: {
    position: 'absolute',
    bottom: 45, // Adjust as needed
    left: width / 2 - 35, // Center calculation
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
},

});
