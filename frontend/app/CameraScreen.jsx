import React, { useRef, useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  TextInput,
  Alert,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from '@react-native-picker/picker';
import { DonutChart } from "react-native-circular-chart";
import { UserContext } from './store/userContext';
import { useNavigation } from '@react-navigation/native';
import { foodImages } from './constants';
import { BASE_URL } from "./config";
import nutritionData from "../assets/data/nutritionData.json";


const API_KEY = "ROBOFLOW_KEY";
const MODEL_URL = "https://serverless.roboflow.com/tradrly-v0je3/9";
const DISPLAY_WIDTH = Dimensions.get("window").width;
const DISPLAY_HEIGHT = Dimensions.get("window").height;

const fallbackImage = require("../assets/foods/not found.png");

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

export default function CameraScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState("grams");
  const sheetAnimation = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { user, addToHistory } = useContext(UserContext);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.processingText}>Click To Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    const manipulated = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: DISPLAY_WIDTH, height:DISPLAY_HEIGHT-200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    setIsProcessing(true);
    setHasRun(false);
    setImageUri(manipulated.uri);

    const { width, height } = await new Promise((resolve, reject) => {
      Image.getSize(manipulated.uri, (w, h) => resolve({ width: w, height: h }), reject);
    });
    setImageDims({ width, height });

    const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    try {
      console.log("requesting");
      
      const response = await axios({
        method: "POST",
        url: MODEL_URL,
        params: { api_key: API_KEY },
        data: base64,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      console.log("requested")
      setResult(response.data);
      setHasRun(true);
      setIsProcessing(false);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleBoundingBoxPress = (pred) => {
    const className = pred.class.toLowerCase();
    const nutrition = nutritionData[className];
    
    if (!nutrition) {
      Alert.alert("Info", "No nutrition data available for this item.");
      return;
    }
    
    setSelectedItem({
      className,
      nutrition,
      description: nutrition.description || "No description available.",
      ingredients: nutrition.ingredients || ["No ingredients available."],
      flagUrl: nutrition.flagUrl,
      foodImage: foodImages[className] || fallbackImage
    });
    
    showDescriptionSheet();
  };

  const showDescriptionSheet = () => {
    setSheetVisible(true);
    Animated.timing(sheetAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideDescriptionSheet = () => {
    Animated.timing(sheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    const defaultValues = {
      grams: '100',
      serving: '1',
      tablespoon: '1',  
      slice: '1',
    };
    const defaultVal = parseFloat(defaultValues[newUnit]) || 1;
    setAmount(defaultVal);
  };

  const handleAddToHistory = async () => {
    if (amount <= 0) {
      Alert.alert("Invalid quantity", "Please enter a valid number of grams.");
      return;
    }
    console.log(amount);
    
    if (!selectedItem) return;
    
    const foodData = {
      email: user.email,
      foodName: selectedItem.className,
      nutrition: selectedItem.nutrition,
      quantity: amount,
    };

    try {
      await axios.post(`${BASE_URL}/save-food-history`, foodData);
      Alert.alert(
        "Added to history!",
        selectedItem.className + " added",
        [
          {
            text: "Return to Home",
            onPress: () => navigation.navigate("HomeScreen"),
          },
          {
            text: "OK",
            onPress: () => console.log("OK Pressed")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add to history");
      console.error(error);
    }
  };

const renderBoundingBoxes = () => {
  if (!result?.predictions || imageDims.width === 0) return null;

  // Calculate the actual displayed image dimensions
  const displayedWidth = DISPLAY_WIDTH - 5; // Your image width with -5 margin
  const displayedHeight = DISPLAY_HEIGHT - 30; // Your image height adjustment

  // Calculate scaling facto
  const scaleX = displayedWidth / imageDims.width;
  const scaleY = displayedHeight / imageDims.height;

  return result.predictions.map((pred, index) => {
    // Calculate bounding box coordinates
    const left = (pred.x - pred.width / 2) * scaleX-50;
    const top = (pred.y - pred.height / 2) * scaleY;
    const width = pred.width * scaleX+80;
    const height = pred.height * scaleY;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.bbox,
          {
            left,
            top,
            width,
            height,
            borderColor: "lime",
          },
        ]}
        onPress={() => handleBoundingBoxPress(pred)}
      >
        <Text style={styles.bboxLabel}>
          {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
        </Text>
      </TouchableOpacity>
    );
  });
};

  const sheetTranslateY = sheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [DISPLAY_HEIGHT, 0],
  });

  // Calculate scaled nutrition values
  const allergies = user?.allergies?.map(a => a.toLowerCase()) || [];
  const healthConditions = user?.healthConditions || [];
  
  let scaledProtein = 0;
  let scaledCarbs = 0;
  let scaledFat = 0;
  let scaledCalories = 0;
  let suitabilityList = [];
  
  if (selectedItem) {
    const unitToGramMap = {
      grams: 1,
      serving: selectedItem.nutrition?.conversion?.serving || 100,
      tablespoon: selectedItem.nutrition?.conversion?.tablespoon || 15,
      "slice/piece": selectedItem.nutrition?.conversion?.slice || 30,
    };
    
    const actualGrams = amount * unitToGramMap[unit];
    const scaleFactor = actualGrams / 100;
    const nutrition = selectedItem.nutrition.nutrition;

    scaledProtein = parseFloat((nutrition.protein.value * scaleFactor).toFixed(2));
    scaledCarbs = parseFloat((nutrition.carbs.value * scaleFactor).toFixed(2));
    scaledFat = parseFloat((nutrition.fat.value * scaleFactor).toFixed(2));
    scaledCalories = parseFloat((nutrition.calories.value * scaleFactor).toFixed(2));
    
    suitabilityList = healthConditions.map((condition) => ({
      condition,
      suitable: isFoodSuitable(nutrition, condition),
    }));
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!imageUri ? (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing="back" ref={cameraRef}>
              <TouchableOpacity 
                style={[styles.buttonWrapper, styles.overlayButton]}
                onPress={takePicture}
              >
                <Text style={styles.button}>Capture & Detect</Text>
              </TouchableOpacity>
            </CameraView>
          </View>
        ) : (
          <View style={styles.imageContainer}>
  <Image
    source={{ uri: imageUri }}
    style={{
      width: DISPLAY_WIDTH - 5,
      height: DISPLAY_HEIGHT - 30,
    }}
  />
  <View
    style={{
      position: "absolute",
      width: DISPLAY_WIDTH - 5,
      height: DISPLAY_HEIGHT - 30,
    }}
  >
              {renderBoundingBoxes()}
            </View>
            <TouchableOpacity
              style={[styles.buttonWrapper, styles.overlayButton]}
              onPress={() => {
                setImageUri(null);
                setResult(null);
                setIsProcessing(false);
                setHasRun(false);
                setError(null);
                hideDescriptionSheet();
              }}
            >
              <Text style={styles.button}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {isProcessing && <Text style={styles.processingText}>Processing...</Text>}
        {hasRun && result?.predictions?.length === 0 && (
          <Text style={[styles.resultText, styles.noObject]}>No objects detected.</Text>
        )}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </ScrollView>

      {/* Description Sheet */}
      {sheetVisible && selectedItem && (
        <Animated.View
            style={[
              styles.descriptionSheet,
              { transform: [{ translateY: sheetTranslateY }] }
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={hideDescriptionSheet}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
           
            <ScrollView style={styles.descriptionScrollView}>
              <Text style={styles.descriptionTitle}>
                {selectedItem.className.charAt(0).toUpperCase() + selectedItem.className.slice(1)}
              </Text>
             
              {selectedItem.foodImage && (
                <Image
                  source={selectedItem.foodImage}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              )}
             
              <Text style={styles.descriptionText}>{selectedItem.description}</Text>
              {selectedItem.flagUrl && (
                <Image
                  source={{ uri: selectedItem.flagUrl }}
                  style={styles.flag}
                  resizeMode="contain"
                />
              )}
              <View style={styles.lineSection} />


              <View style={styles.ingredientsContainer}>
    <Text style={styles.sectionHeader}>Ingredients:</Text>
    <View style={styles.ingredientsGrid}>
      {selectedItem.ingredients.map((item, index) => {
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
  </View>
  <View style={styles.lineSection} />


             
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
  {selectedItem.nutrition?.conversion?.serving && (
    <Picker.Item label="Serving" value="serving" />
  )}
  {selectedItem.nutrition?.conversion?.tablespoon && (
    <Picker.Item label="Tablespoon" value="tablespoon" />
  )}
  {selectedItem.nutrition?.conversion?.slice && (
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
               
             
              <View style={styles.lineSection} />
                <Text style={styles.nutritionTitle}>Nutritional Information (Per 100g)</Text>
              <View style={styles.nutritionCard}>
                {selectedItem.nutrition.nutrition.calories && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Calories:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.calories.value} {selectedItem.nutrition.nutrition.calories.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.protein && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Protein:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.protein.value} {selectedItem.nutrition.nutrition.protein.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.carbs && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Carbs:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.carbs.value} {selectedItem.nutrition.nutrition.carbs.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.fat && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fat:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.fat.value} {selectedItem.nutrition.nutrition.fat.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.fiber && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fiber:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.fiber.value} {selectedItem.nutrition.nutrition.fiber.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.totalSugars && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Total Sugars:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.totalSugars.value} {selectedItem.nutrition.nutrition.totalSugars.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.sodium && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sodium:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.sodium.value} {selectedItem.nutrition.nutrition.sodium.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.potassium && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Potassium:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.potassium.value} {selectedItem.nutrition.nutrition.potassium.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.iron && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Iron:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.iron.value} {selectedItem.nutrition.nutrition.iron.unit}
                    </Text>
                  </View>
                )}
               
                {selectedItem.nutrition.nutrition.vitaminD && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Vitamin D:</Text>
                    <View style={styles.line} />
                    <Text style={styles.nutritionValue}>
                      {selectedItem.nutrition.nutrition.vitaminD.value} {selectedItem.nutrition.nutrition.vitaminD.unit}
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
          </Animated.View>

      )}
    </View>
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
    camera: {
      width: DISPLAY_WIDTH-5,
      height: DISPLAY_HEIGHT - 30,
      overflow: "hidden",
      alignItems: "center",
      alignSelf: "center",
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
    cameraContainer: {
      width: DISPLAY_WIDTH,
      height: DISPLAY_HEIGHT - 30,
      position: 'relative',
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
      height: DISPLAY_HEIGHT *0.8,
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
      width: DISPLAY_WIDTH * 0.6,
      height: DISPLAY_WIDTH * 0.6,
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
