// components/StockChart.js

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts'; // Import du LineChart
import colors from '../config-colors';
import textStyles from '../config-texts';

// Fonction pour générer des données boursières simulées
const generateStockData = () => {
  const data = [];
  let lastPrice = 1000; // Prix de départ (1000€ par exemple)

  for (let i = 0; i < 60; i++) { // Générer 30 points (correspondant à 30 jours par exemple)
    // Simuler une variation aléatoire entre -5% et +5%
    const changePercent = (Math.random() * 80 -40) / 100;
    const newPrice = lastPrice + lastPrice * changePercent;
    data.push({
      value: parseFloat(newPrice.toFixed(2)), // Prix arrondi à 2 décimales
      label: ``, // Étiquettes des jours : J1, J2, etc.
    });
    lastPrice = newPrice;
  }
  return data;
};

const StockChart = () => {
  // Générer les données du graphique une seule fois, lors du montage du composant
  const stockChartData = useMemo(() => generateStockData(), []);

  return (
    <View style={styles.chartContainer}>

<LineChart
  data={stockChartData}
  width={265}
  height={180}
  color={colors.indigo}
  isAnimated
  hideRules
  initialSpacing={0}
  spacing={10}
  rulesType="solid"
  hideAxesAndRules
  hideDataPoints={true}
  hideShadow={false}
  shadowColor={colors.indigo}
  shadowOpacity={0.2}
  shadowGradientStop={0.8}
  frontColor={colors.indigo}
  dataPointsHeight={6}
  noOfSections={4}
  decimalPlaces={0.2}
  thickness={2}
  curved
  xAxisColor={colors.grey3}
  yAxisColor={colors.grey3}
  hideYAxisText={true} // Cache le texte de l'axe Y
/>

    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical:20,
    alignItems: 'center',
  },
});

export default StockChart;
