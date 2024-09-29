// components/StockChart.js

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Import du LineChart depuis react-native-chart-kit
import colors from '../config-colors';
import textStyles from '../config-texts';
import { Dimensions } from 'react-native';

// Fonction pour générer des données boursières simulées
const generateStockData = () => {
  const data = [];
  const labels = [];
  let lastPrice = 1000; // Prix de départ (1000€ par exemple)

  for (let i = 0; i < 60; i++) {
    // Simuler une variation aléatoire entre -40% et +40%
    const changePercent = (Math.random() * 80 - 40) / 100;
    const newPrice = lastPrice + lastPrice * changePercent;
    data.push(parseFloat(newPrice.toFixed(2))); // Prix arrondi à 2 décimales
    labels.push(''); // Étiquettes vides pour l'axe X
    lastPrice = newPrice;
  }
  return { data, labels };
};

const StockChart = () => {
  // Générer les données du graphique une seule fois, lors du montage du composant
  const stockChartData = useMemo(() => generateStockData(), []);

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: stockChartData.labels,
          datasets: [
            {
              data: stockChartData.data,
              color: (opacity = 1) => colors.indigo, // Couleur de la ligne
              strokeWidth: 2, // Épaisseur de la ligne
            },
          ],
        }}
        width={280}
        height={180}
        chartConfig={{
          backgroundColor: colors.grey2,
          backgroundGradientFrom: colors.grey2,
          backgroundGradientTo: colors.grey2,
          decimalPlaces: 2, // Nombre de décimales
          color: (opacity = 1) => colors.indigo,
          labelColor: (opacity = 1) => colors.black2,
          style: {
            borderRadius: 0,
          },
          propsForBackgroundLines: {
            strokeWidth: 0, // Cache les lignes de fond
          },
          propsForDots: {
            r: '0', // Cache les points de données
            strokeWidth: '0',
          },
        }}
        bezier // Rend la ligne courbée
        withDots={true} // Cache les points de données
        withInnerLines={true} // Cache les lignes internes
        withOuterLines={true} // Cache les lignes externes
        withVerticalLabels={true} // Cache les étiquettes verticales
        withHorizontalLabels={true} // Cache les étiquettes horizontales
        withShadow={true} // Affiche l'ombre sous la ligne
        style={{
          borderRadius: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: colors.grey1
  },
});

export default StockChart;
