import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

export default function DescriptionSheetContent({ className }) {
  // You can customize this data per className (e.g., Lablebi)
  return (
    <ScrollView contentContainerStyle={styles.sheetContent}>
      <Text style={styles.title}>Lablebi</Text>
      <Text style={styles.subtitle}>A spicy Tunisian chickpea soup with bread, egg, and harissa.</Text>

      <View style={styles.circleStats}>
        <Text style={styles.kcalText}>420 kcal</Text>
        <Text style={styles.macro}>🟤 45g protein</Text>
        <Text style={styles.macro}>🟣 25g carb</Text>
        <Text style={styles.macro}>🟢 15g fat</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.positive}>✔ Hypertension: Suitable</Text>
        <Text style={styles.negative}>✘ Obesity: Not recommended</Text>
        <Text style={styles.negative}>✘ Diabetes: Not recommended</Text>
      </View>

      <Text style={styles.sectionHeader}>Ingredients</Text>
      <View style={styles.ingredientRow}>
        <Text>🧂 Salt</Text>
        <Text>🌶 Red pepper</Text>
        <Text>🐟 Canned tuna</Text>
        <Text>🍳 Eggs</Text>
        <Text>🍞 Bread</Text>
        <Text>🟤 Chickpeas</Text>
      </View>

      <Text style={styles.sectionHeader}>Nutritional Information (Per 100g)</Text>
      <Text>Calories: 223 kcal</Text>
      <Text>Protein: 25g</Text>
      <Text>Fat: 10g</Text>
      <Text>Carbohydrates: 13g</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  circleStats: {
    marginVertical: 10,
  },
  kcalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  macro: {
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    marginVertical: 10,
  },
  positive: {
    color: 'green',
    marginBottom: 4,
  },
  negative: {
    color: 'red',
    marginBottom: 4,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
    fontSize: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
