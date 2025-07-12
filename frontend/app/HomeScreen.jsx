import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { format, isSameDay, addDays, subDays } from "date-fns";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import axios from 'axios';
import { UserContext } from './store/userContext';
import { BASE_URL } from './config';
import { useContext } from 'react';
import { foodImages } from './constants';
import { Jost_800ExtraBold } from '@expo-google-fonts/jost/800ExtraBold';
import { Jost_700Bold_Italic } from '@expo-google-fonts/jost/700Bold_Italic';
import { Jost_200ExtraLight } from '@expo-google-fonts/jost/200ExtraLight';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';

import { useFonts } from '@expo-google-fonts/jost/useFonts';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons'; // or your logo/icon
import { DonutChart } from "react-native-circular-chart";

const { width } = Dimensions.get("window");

const generateCalendarDays = (past = 60, future = 1) => {
  const today = new Date();
  return Array.from({ length: past + future }, (_, i) => {
    const offset = i - past;
    const date = addDays(today, offset);
    return {
      label: format(date, "EEE"),
      day: format(date, "d"),
      fullDate: date,
    };
  });
};

const calendarDays = generateCalendarDays();

const IntakeSummary = () => {
  let [fontsLoaded] = useFonts({
        Jost_800ExtraBold,Jost_700Bold_Italic, Jost_200ExtraLight,Jost_500Medium,
      });
  const MacronutrientDonutChart = ({ protein, carbs, fat, calories }) => {
  const { width } = Dimensions.get("window");
  const PADDING = 60;

  // Default null/undefined to 0
  const p = protein ?? 0;
  const c = carbs ?? 0;
  const f = fat ?? 0;

  const total = p + c + f;

  let DATA;

  if (total === 0) {
    // Show a full gray circle to indicate no data
    DATA = [
      {
        value: 100,
        color: "#525252",  // light gray
        text: "No data",
      },
    ];
  } else {
    // Calculate percentages normally
    const proteinPercent = Math.round((p / total) * 100);
    const carbsPercent = Math.round((c / total) * 100);
    const fatPercent = Math.round((f / total) * 100);

    DATA = [
      { value: proteinPercent, color: "#9BB9AF", text: `${proteinPercent}%` },
      { value: carbsPercent, color: "#DA7658", text: `${carbsPercent}%` },
      { value: fatPercent, color: "#B29BB9", text: `${fatPercent}%` },
    ];
  }

  return (
    <View style={[styles.sectionWrapper, { backgroundColor: "transparent" }]}>
      <View style={{ position: "relative", width: width - PADDING * 2, height: 150 }}>
        <DonutChart
          data={DATA}
          strokeWidth={15}
          radius={90}
          containerWidth={width - PADDING * 2}
          containerHeight={200}
          type="round"
          startAngle={-90}
          endAngle={90}
          animationType="slide"
          labelValueStyle={{ display: "none" }}
          labelTitleStyle={{ display: "none" }}
          labelWrapperStyle={{ display: "none" }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: -40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontFamily:'Jost_800ExtraBold', color: "#fff",textAlign:'center' }}>
            {calories.toFixed(0) ?? 0} kcal
          </Text>
        </View>
      </View>
    </View>
  );
};

  const navigation = useNavigation();
  const today = new Date();
  const flatListRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user } = useContext(UserContext);
  const [dayHistory, setDayHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const nav = useNavigation();
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
const { setUser } = useContext(UserContext); // add this line at the top

  // Scroll to today on mount
  useEffect(() => {
  const lastIndex = calendarDays.length - 1;
  setSelectedIndex(lastIndex);
  setTimeout(() => {
    flatListRef.current?.scrollToIndex({ index: lastIndex, animated: false });
  }, 50);
}, []);

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user-history/${user.email}`);
      if (res.data.status === 'ok') {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };
  fetchHistory();
}, []);
useEffect(() => {
  const selectedDate = calendarDays[selectedIndex]?.fullDate;
  if (!selectedDate) return;

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const filtered = history.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= startOfDay && itemDate < endOfDay;
  });

  setDayHistory(filtered); // <-- Save filtered history for the day

  const newTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  for (const item of filtered) {
    const quantity = item.quantity || 0;
    const factor = quantity / 100;

    newTotals.calories += (item.nutrients?.nutrition?.calories?.value || 0) * factor;
    newTotals.protein  += (item.nutrients?.nutrition?.protein?.value || 0) * factor;
    newTotals.carbs    += (item.nutrients?.nutrition?.carbs?.value || 0) * factor;
    newTotals.fat      += (item.nutrients?.nutrition?.fat?.value || 0) * factor;
  }

  setTotals(newTotals);
}, [selectedIndex, history]);



  const currentMonthYear = format(calendarDays[selectedIndex]?.fullDate, "MMMM yyyy");



  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    
    <View style={styles.container}>
          <View style={styles.welcomeRow}>
      <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.greeting}>Welcome back, </Text>
        <Text style={styles.weekText}>{user?.name}</Text>
      </View>
      <TouchableOpacity style={styles.calendarButton} onPress={() => {setUser(null); navigation.navigate('LoginScreen');}}>
        <Ionicons name="log-out-outline" size={24} color="#6B6B6B" />
      </TouchableOpacity>

    </View>

      <Text style={styles.header}>Intake Summary</Text>
      <View style={styles.view}>
	    <View style={styles.box2}>
        
      <View style={styles.box}>
      <Text style={styles.monthLabel}>{currentMonthYear}</Text>
      <FlatList
        ref={flatListRef}
        data={calendarDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: 53,
          offset: 53 * index,
          index,
        })}
        contentContainerStyle={styles.weekRow}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => {
          const isToday = isSameDay(item.fullDate, today);
          const isSelected = index === selectedIndex;

          let containerStyle = styles.day;
          let labelStyle = styles.dayLabel;
          let dayNumStyle = styles.dayNum;

          if (isSelected) {
            containerStyle = { ...containerStyle, ...styles.activeDay };
          }
          if (isToday) {
            containerStyle = { ...containerStyle, ...styles.today };
            labelStyle = { ...labelStyle, color: '#A5CEC0' }; // ← Light green for today
            dayNumStyle = { ...dayNumStyle, color: '#A5CEC0' };
          }


          
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedIndex(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
              style={containerStyle}
            >
              <Text style={styles.dayLabel}>{item.label}</Text>
              <Text style={styles.dayNum}>{item.day}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.ringsContainer}>
        <MacronutrientDonutChart
          protein={totals.protein}
          carbs={totals.carbs}
          fat={totals.fat}
          calories={totals.calories}
        />


      </View>
<View style={styles.macroRow}>
  <View style={styles.macroItem}>
    <Text style={styles.macroText}>{totals.protein.toFixed(2)}g</Text>
    <Text style={styles.macroLabel}>Protein</Text>
  </View>
  <View style={styles.macroItem}>
    <Text style={styles.macroText}>{totals.carbs.toFixed(2)}g</Text>
    <Text style={styles.macroLabel}>Carbs</Text>
  </View>
  <View style={styles.macroItem}>
    <Text style={styles.macroText}>{totals.fat.toFixed(2)}g</Text>
    <Text style={styles.macroLabel}>Fat</Text>
  </View>
</View>
      </View>  
        
    </View>
    </View>
    <View style={styles.historyContainer}>
  <Text style={styles.header}>History</Text>
  {dayHistory.length === 0 ? (
  <Text style={styles.noFoodText}>No food logged for this day.</Text>
) : (
  <ScrollView 
  style={{ maxHeight: 250 }} 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 120 }} // 👈 Add this
>
    {dayHistory.map((item, index) => (
      <Pressable
        key={index}
        onPress={() => navigation.navigate('Description', { className: item.foodName })}
        style={styles.card}
      >
        <Image
          source={foodImages[item.foodName] || require('../assets/foods/not found.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.foodName}</Text>
          {item.quantity && (
            <Text style={styles.date}>
              Quantity: {item.quantity}g
              <Text>         </Text>
              Calories: {(item.nutrients?.nutrition?.calories?.value || 0) * item.quantity / 100}g
            </Text>
            
          )}

        </View>
        <View style={styles.arrowCircle}>
        <Icon name="chevron-right" size={28} color="#BFC8D0" />
      </View>
      </Pressable>
    ))}
  </ScrollView>
)}

</View>
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
};

export default IntakeSummary;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginHorizontal:5,
    color: "#000",
    fontSize: 22,
    fontFamily:'Jost_800ExtraBold',
    marginBottom: 10,
  },
  monthLabel: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
    fontFamily:'Jost_500Medium',
  },
  box: {
  backgroundColor: "#1A1D1C",
  borderRadius: 20,
  padding: 0,
  alignItems: "center",
  justifyContent: "center",
  margin:15
},
  weekRow: {
    flexDirection: "row",
    paddingBottom: 0,
  },
  day: {
  alignItems: "center",
  justifyContent: "center",
  width: 45,          // was 60
  height: 45,         // was 60
  borderRadius: 22.5, // was 30
  marginHorizontal: 4,
  backgroundColor: "#1C2220",
  opacity: 0.4,
},
  activeDay: {
    borderWidth: 2,
    borderColor: "#fff",
    opacity: 1,
  },
  today: {
    backgroundColor: "#2E2F2F",
    borderColor: "#A5CEC0",
    borderWidth: 2,
    opacity: 1,
  },
  dayLabel: {
  color: "#fff",
  fontSize: 11, // was 13
  fontFamily:'Jost_200ExtraLight',
},
dayNum: {
  fontFamily:'Jost_500Medium',
  color: "#fff",
  fontSize: 12, // was 14
},

  ringsContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  caloriesText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },


  box2: {
    backgroundColor: "#1A1D1C",
		flexDirection: "row",
	},
	view: {
		backgroundColor: "#1A1D1C",
		borderRadius: 24,
		padding: 16,
	},
  macroRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: -20,
  width: "100%",
  height:"7%",
  alignItems: "center",
  textAlign: 'center',
  
},
macroItem: {
  alignItems: "center",
  justifyContent: 'center',
},
macroText: {
  color: "#fff",
  fontSize: 15,
  fontFamily:'Jost_500Medium',
  textAlign: "center",
  width: 50,
  marginBottom:-2,
},
macroLabel: {
  fontSize: 10,
  color: "#ccc",
  textAlign: 'center',
  fontFamily:'Jost_500Medium',
},
historyContainer: {
  marginTop: 20,
  width: "100%",
  paddingHorizontal: 0,
},
historyTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
noFoodText: {
  color: "#000",
  fontFamily:'Jost_200ExtraLight',

},
foodItem: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
  backgroundColor: "#2E2F2F",
  padding: 12,
  borderRadius: 12,
},
foodName: {
  color: "#fff",
  fontSize: 10,
},

image: {
  width: 60,
  height: 60,
  borderRadius: 12,
  marginRight: 14,
  backgroundColor: '#eee',
},
  card: {
  flexDirection: 'row',
  backgroundColor: '#ffffff', // light card for contrast
  borderRadius: 16,
  padding: 12,
  marginBottom: 10,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  width: '100%',
  minHeight: 80,
  elevation: 3,
},
  info: {
  flex: 1,
  justifyContent: 'center',
},
name: {
  fontSize: 15,
  color: '#333',
  marginBottom: 2,
  fontFamily:'Jost_500Medium',
},
date: {
  fontSize: 12,
  color: '#666',
  marginBottom: 2,
  fontFamily:'Jost_500Medium',
},
arrowCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#F1F3F6',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 12,
},
welcomeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 5,
  marginBottom: 16,
},
avatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#eee',
},
greeting: {
  fontSize: 16,
  color: '#6B6B6B',
  fontFamily:'Jost_500Medium',
},
weekText: {
  fontSize: 20,
  fontFamily:'Jost_700Bold_Italic',
  color: '#1C2220',
},
calendarButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#F1F3F6',
  alignItems: 'center',
  justifyContent: 'center',
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
