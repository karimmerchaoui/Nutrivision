// DescriptionScreen.jsx
 
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, TextInput ,Alert} from "react-native";

import nutritionData from "../assets/data/nutritionData.json"; // adjust path as needed
import { Inter_100Thin } from '@expo-google-fonts/inter/100Thin';
import * as Font from 'expo-font';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect,useContext} from "react";
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one/400Regular';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { DonutChart } from "react-native-circular-chart";
import { UserContext } from './store/userContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { foodImages } from './constants';
import { BASE_URL } from "./config";


const screenWidth = Dimensions.get("window").width;




const fallbackImage = require("../assets/foods/not found.png");

export const getFoodImage = (foodName) => {
  const key = foodName.trim().toLowerCase().replace(/\s+/g, "_");
  return foodImages[key] || fallbackImage;
};



const MacronutrientDonutChart = ({ protein, carbs, fat, calories }) => {
  const { width } = Dimensions.get("window");
  const PADDING = 16;
  
  // Calculate percentages
  const total = protein + carbs + fat;
  const proteinPercent = Math.round((protein / total) * 100);
  const carbsPercent = Math.round((carbs / total) * 100);
  const fatPercent = Math.round((fat / total) * 100);

  // Prepare data for DonutChart
  const DATA = [
    {
      value: proteinPercent,
      color: "#9BB9AF",
      text: `${proteinPercent}%`,
    },
    {
      value: carbsPercent,
      color: "#DA7658",
      text: `${carbsPercent}%`,
    },
    {
      value: fatPercent,
      color: "#B29BB9",
      text: `${fatPercent}%`,
    },
  ];

  return (
    <View style={[styles.sectionWrapper, {backgroundColor: 'transparent'}]}>
      <Text style={styles.chartTitle}>Macronutrients</Text>
      
      <View style={{ position: 'relative', width: width - PADDING * 2, height: 200 }}>
        <DonutChart
          data={DATA}
          strokeWidth={15}
          radius={90}
          containerWidth={width - PADDING * 2}
          containerHeight={200}
          type="round"
          startAngle={0}
          endAngle={360}
          animationType="slide"
          labelValueStyle={{ display: 'none' }}
          labelTitleStyle={{ display: 'none' }}
          labelWrapperStyle={{ display: 'none' }}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#000' }}>
            {calories} kcal
          </Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#9BB9AF'}]} />
          <Text style={styles.legendText}>Protein: {protein}g</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#DA7658'}]} />
          <Text style={styles.legendText}>Carbs: {carbs}g</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#B29BB9'}]} />
          <Text style={styles.legendText}>Fat: {fat}g</Text>
        </View>
      </View>
    </View>
  );
};


function isFoodSuitable(nutrition, condition) {
  
  const { calories, protein, carbs, fat, fiber, totalSugars, sodium, potassium, iron } = nutrition;
  
  switch (condition?.toLowerCase()) {
    case "diabetes":
      return carbs.value <= 30 && totalSugars?.value <= 5 && fiber?.value >= 3;
    case "hypertension":
      return sodium?.value <= 150;
    case "obesity":
      return calories.value <= 400 && fat.value <= 10 && totalSugars?.value <= 5;
    case "highcholesterol":
      return fat.value <= 10 && fiber?.value >= 3;
    case "kidneydisease":
      return potassium?.value <= 200 && sodium?.value <= 150 && protein.value <= 10;
    case "anemia":
      return iron?.value >= 2;
    case "heartdisease":
      return fat.value <= 10 && sodium?.value <= 150 && fiber?.value >= 3;
    default:
      return true;
  }
}


  
export default function DescriptionScreen({ route }) {
  
  
  const navigation = useNavigation();
  const { className } = route.params;
  console.log(className);
  const description = nutritionData[className].description || "No description available.";
  
  const nutrition = nutritionData[className];

  const flagUrl = nutritionData[className].flagUrl;
  const foodImage = foodImages[className];
  const [fontLoaded, setFontLoaded] = useState(false);
  const [amount, setAmount] = useState(100); // default 100g
  const [quantity, setQuantity] = useState('100');
  const defaultValues = {
    grams: '100',
    serving: '1',
    tablespoon: '1',  
    slice: '1',
  };
  const [unit, setUnit] = useState("grams");

const unitToGramMap = {
  grams: 1,
  serving: nutritionData[className]?.conversion?.serving || 100,
  tablespoon: nutritionData[className]?.conversion?.tablespoon || 15,
  "slice/piece": nutritionData[className]?.conversion?.slice || 30,
};

  const { user,addToHistory } = useContext(UserContext);
  const allergies = user?.allergies?.map(a => a.toLowerCase()) || [];
  const healthConditions = user?.healthConditions || []; // assuming it's an array
const actualGrams = amount * unitToGramMap[unit]; // Convert to grams
const scaleFactor = actualGrams / 100;

const scaledProtein = parseFloat((nutrition.nutrition.protein.value * scaleFactor).toFixed(2));
const scaledCarbs = parseFloat((nutrition.nutrition.carbs.value * scaleFactor).toFixed(2));
const scaledFat = parseFloat((nutrition.nutrition.fat.value * scaleFactor).toFixed(2));
const scaledCalories = parseFloat((nutrition.nutrition.calories.value * scaleFactor).toFixed(2));

  const suitabilityList = healthConditions.map((condition) => ({
  condition,
  suitable: isFoodSuitable(nutritionData[className].nutrition, condition),
}));


  
  const handleAddToHistory = async () => {
    if (amount <= 0) {
  Alert.alert("Invalid quantity", "Please enter a valid number of grams.");
  return;
  }
  
    if (nutrition) {
      const foodData = {
      email: user.email,
      foodName: className,
      nutrition,
      quantity: actualGrams,
    };

      console.log("requesting_history");
      console.log(BASE_URL);
      
       await axios.post(`${BASE_URL}/save-food-history`,foodData);

        console.log("requested_history");
      Alert.alert(
  "Added to history!",
  className + " added",
  [
    {
      text: "Return to Home",
      onPress: () => {
        // Your navigation logic here
        navigation.navigate("HomeScreen"); // Replace with your actual screen name
      }
    },
    {
      text: "OK",
      onPress: () => console.log("OK Pressed")
    }
  ]
);
      
    }
  };

  useEffect(() => {
    async function loadFont() {
      
      await Font.loadAsync({
        'LilitaOne_Regular': LilitaOne_400Regular,
      });
      await Font.loadAsync({
        'Inter-Thin': Inter_100Thin,
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);
  const handleUnitChange = (newUnit) => {
  setUnit(newUnit);
  const defaultVal = parseFloat(defaultValues[newUnit]) || 1;
  setAmount(defaultVal);
};
  if (!fontLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }
  return (
    
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70,alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.descriptionTitle}>{className.charAt(0).toUpperCase() + className.slice(1)}</Text>
      {foodImage && (
  <Image
    source={foodImage}
    style={styles.foodImage}
    resizeMode="cover"
  />
)}
      <Text style={styles.descriptionText}>{description}</Text>
   
   
       <View style={styles.ingredientsContainer}>
       <Text style={styles.sectionHeader}>Ingredients:</Text>
       <View style={styles.ingredientsGrid}>
  
  {nutrition.ingredients.map((item, index) => {
          const isAllergen = allergies.some(allergy =>
            item.toLowerCase().includes(allergy)
          );
          return (
            <View key={index} style={styles.ingredientItem}>
              <Text
                style={[styles.ingredientText, isAllergen && { color: 'red' }]}
              >
                • {item} {isAllergen ? "❌" : ""}
              </Text>
            </View>
          );
        })}
          </View>


      {flagUrl && (
        <Image
          source={{ uri: flagUrl }}
          style={styles.flag}
          resizeMode="contain"
        />
      )}
      </View>
      <MacronutrientDonutChart
                      protein={scaledProtein}
                      carbs={scaledCarbs}
                      fat={scaledFat}
                      calories={scaledCalories}
                    />
                    <View style={styles.quantityControls}>
        <View style={styles.quantityRow}>
          <View style={styles.quantityItem}>
            <Text style={styles.controlLabel}>Unit:</Text>
            <View style={styles.pickerContainer}>
              <Picker
        selectedValue={unit}
        style={styles.picker}
        onValueChange={handleUnitChange}
      >
        <Picker.Item label="Grams" value="grams" />
        {nutrition.nutrition?.conversion?.serving && (
          <Picker.Item label="Serving" value="serving" />
        )}
        {nutrition.nutrition?.conversion?.tablespoon && (
          <Picker.Item label="Tablespoon" value="tablespoon" />
        )}
        {nutrition.nutrition?.conversion?.slice && (
          <Picker.Item label="Slice/Piece" value="slice" />
        )}
      </Picker>
            </View>
          </View>
      
      
          <View style={styles.quantityItem}>
            <Text style={styles.controlLabel}>Quantity:</Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={amount.toString()}
              onChangeText={(text) => {
                const sanitized = text.replace(/[^0-9.]/g, '');
                const parts = sanitized.split('.');
                const cleanText = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
                const parsed = cleanText.trim() === '' ? 1 : parseFloat(cleanText);
                setAmount(isNaN(parsed) ? 0 : parsed);
              }}
              placeholder="Enter amount"
            />
          </View>
        </View>
      </View>
      
      
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddToHistory}
                    >
                      <Text style={styles.addButtonText}>Add to History</Text>
                    </TouchableOpacity>
                     
      
        <Text style={styles.nutritionTitle}>Nutritional Information (Per 100g)</Text>
                    <View style={styles.nutritionCard}>
                      {nutrition.nutrition.calories && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Calories:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.calories.value} {nutrition.nutrition.calories.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.protein && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Protein:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.protein.value} {nutrition.nutrition.protein.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.carbs && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Carbs:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.carbs.value} {nutrition.nutrition.carbs.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.fat && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Fat:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.fat.value} {nutrition.nutrition.fat.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.fiber && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Fiber:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.fiber.value} {nutrition.nutrition.fiber.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.totalSugars && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Total Sugars:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.totalSugars.value} {nutrition.nutrition.totalSugars.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.sodium && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Sodium:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.sodium.value} {nutrition.nutrition.sodium.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.potassium && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Potassium:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.potassium.value} {nutrition.nutrition.potassium.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.iron && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Iron:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.iron.value} {nutrition.nutrition.iron.unit}
                          </Text>
                        </View>
                      )}
                     
                      {nutrition.nutrition.vitaminD && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionLabel}>Vitamin D:</Text>
                          <View style={styles.line} />
                          <Text style={styles.nutritionValue}>
                            {nutrition.nutrition.vitaminD.value} {nutrition.nutrition.vitaminD.unit}
                          </Text>
                        </View>
                      )}
                     
                      <View style={styles.healthConditions}>
                        <Text style={styles.nutritionTitle}>Health Conditions:</Text>
                        {suitabilityList.length === 0 ? (
                          <Text style={styles.noConditionsText}>No health conditions provided.</Text>
                        ) : (
                          suitabilityList.map(({ condition, suitable }) => (
                            <Text
                              key={condition}
                              style={[
                                styles.conditionText,
                                suitable ? styles.suitableCondition : styles.notSuitableCondition
                              ]}
                            >
                              {suitable ? "✅" : "❌"} {condition.charAt(0).toUpperCase() + condition.slice(1)}: {suitable ? "Suitable" : "Not Recommended"}
                            </Text>
                          ))
                        )}
                      </View>
                    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
     
      paddingBottom: 20,
    },
    buttonWrapper: {
      marginTop: 20,
      backgroundColor: "#95bab0",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderColor: "#000",
      borderWidth: 1
    },
    button: {
      color: "#fff",
      fontSize: 22,
      fontFamily:'Jost_800ExtraBold',
    },
    imageContainer: {
      position: "relative",
      marginBottom: 20,
    },
    bbox: {
      position: "absolute",
      borderWidth: 2,
      zIndex: 2,
    },
    bboxLabel: {
      backgroundColor: "rgba(0,0,0,0.6)",
      color: "#fff",
      fontSize: 12,
      padding: 2,
    },
    resultText: {
      color: "#000",
      marginTop: 100,
      fontSize: 20,
      textAlign:'center',
      fontFamily:'Jost_200ExtraLight'
      
    },
    errorText: {
      color: "red",
      fontSize: 16,
      marginTop: 10,
    },
    processingText: {
      color: "#000",
      marginTop: 10,
      fontSize: 25,
      textAlign:'center',
      fontFamily:'Jost_200ExtraLight'
    },
    overlayButton: {
      position: "absolute",
      bottom: 30,
      alignSelf: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderColor: "#fff",
      borderWidth: 2,
      backgroundColor: "transparent",
      zIndex: 10,
    },
    noObject: {
      position: "absolute",
      bottom: 150,
      alignSelf: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "transparent",
      zIndex: 10,
    },
    descriptionSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: screenWidth,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    descriptionScrollView: {
      flex: 1,
    },
    descriptionTitle: {
      fontSize: 35,
      color: '#000',
      marginBottom: 5,
      textAlign: 'center',
      fontFamily:'Jost_800ExtraBold',
    },
    descriptionText: {
      fontSize: 16,
      color: '#000',
      marginBottom: 40,
      lineHeight: 22,
      fontFamily:'Jost_500Medium',
    },
    foodImage: {
      width: screenWidth * 0.6,
      height: screenWidth * 0.6,
      borderRadius: 12,
      alignSelf: 'center',
      marginBottom: 15,
    },
    ingredientsContainer: {
      marginBottom: 15,
    },
    sectionHeader: {
      fontSize: 22,
      fontFamily:'Jost_500Medium',
      color: '#000',
      marginBottom: 15,
    },
    ingredientText: {
      fontSize: 16,
      color: '#000',
      marginLeft: 10,
      fontFamily:'Jost_300Light_Italic'
    },
    flag: {
      width: 75,
      height: 45,
      borderRadius: 6,
      alignSelf: 'center',
      marginBottom: 15,
    },
    quantityControls: {
      marginVertical: 15,
    },
    controlLabel: {
      fontSize: 16,
      fontFamily:'Jost_500Medium',
      color: '#000',
      marginBottom: 5,
    },
    pickerContainer: {
      backgroundColor: '#ededed',
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      width: '100%',
      color: '#000',
    },
    quantityInput: {
      backgroundColor: '#ededed',
      borderRadius: 8,
      padding: 10,
      color: '#000',
      fontSize: 16,
    },
    addButton: {
      backgroundColor: '#1b211f',
      padding: 15,
      borderRadius: 20,
      alignItems: 'center',
      marginVertical: 15,
    },
    addButtonText: {
      color: '#fff',
      fontFamily:'Jost_500Medium',
      fontSize: 18,
    },
    sectionWrapper: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: "transparent",
      marginVertical: 1,
      padding: 16,
      width: '100%',
    },
    chartTitle: {
      color: "#000",
      fontSize: 18,
      fontFamily:'Jost_500Medium',
      marginBottom: 10,
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
    },
    legendColor: {
      width: 10,
      height: 10,
      borderRadius: 7.5,
      marginRight: 5,
    },
    legendText: {
      color: '#000',
      fontSize: 12,
      fontFamily:'Jost_300Light',


    },
    nutritionCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  marginTop: 15,
  borderWidth: 0.5,          // Border thickness
  borderColor: '#000000',  // Border color (black in this example)
},
    nutritionTitle: {
      fontSize: 18,
      fontFamily:'Jost_500Medium',
      color: '#000',
      marginBottom: 1,
    },
    nutritionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    nutritionLabel: {
      color: '#000',
      fontSize: 16,
      fontFamily:'Jost_300Light',
    },
    nutritionValue: {
      color: '#000',
      fontSize: 16,
      fontWeight: '600',
      fontFamily:'Jost_300Light',
      textAlign: 'right',
    },
    healthConditions: {
      marginTop: 15,
    },
    conditionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 8,
    },
    conditionText: {
      fontSize: 16,
      marginVertical: 4,
      fontFamily:'Jost_500Medium',
    },
    suitableCondition: {
      color: '#4CAF50',
    },
    notSuitableCondition: {
      color: '#FF5252',
    },
    noConditionsText: {
      color: '#fff',
      fontSize: 16,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 11,
    },
    closeButtonText: {
      fontSize: 20,
      color: '#000',
      fontWeight: 'bold',
    },
    ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ingredientItem: {
    width: '48%', // Slightly less than 50% to account for spacing
    marginBottom: 8,
  },
 
line: {
  flex: 2,
  height: 1,
  backgroundColor: '#e0e0e0',
  marginHorizontal: 10,
},
lineSection: {
  flex: 2,
  height: 1,
  backgroundColor: '#c4c4c4',
  marginHorizontal: 10,
  marginBottom:30,
  marginTop:30,
  opacity:0.4,
},
quantityControls: {
  marginVertical: 15,
  width: '100%',
},
quantityRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 15, // Adds space between the two items
},
quantityItem: {
  flex: 1, // Each item takes equal width
},
pickerContainer: {
  backgroundColor: '#ededed',
  borderRadius: 8,
  overflow: 'hidden',
  marginTop: 5,
},
picker: {
  height: 50,
  width: '100%',
  color: '#000',
},
quantityInput: {
  backgroundColor: '#ededed',
  borderRadius: 8,
  padding: 10,
  color: '#000',
  fontSize: 16,
  marginTop: 5,
  height: 50, // Match picker height
},


  });
