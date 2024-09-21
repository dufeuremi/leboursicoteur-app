// Import necessary packages and configuration
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

const RankItem = ({ user }) => {
  // État pour le taux de variation et sa valeur absolue
  const [variationRate, setVariationRate] = useState(0);
  const [variationRateAbs, setVariationRateAbs] = useState(0);

  // Référence pour stocker la valeur précédente de 'user.amount'
  const previousAmountRef = useRef(user.amount);

  useEffect(() => {
    const previousAmount = previousAmountRef.current;

    // Calculer le taux de variation
    if (previousAmount !== 0) { // Éviter la division par zéro
      const variation = ((user.amount - previousAmount) / previousAmount) * 100;
      setVariationRate(variation.toFixed(2)); // Limiter à 2 décimales
      setVariationRateAbs(Math.abs(variation).toFixed(2)); // Valeur absolue
    } else {
      setVariationRate(0);
      setVariationRateAbs(0);
    }

    // Mettre à jour la valeur précédente
    previousAmountRef.current = user.amount;
  }, [user.amount]);

  // Définir la couleur et le symbole en fonction du changement
  const isPositive = parseFloat(variationRate) >= 0;
  const changeColor = isPositive ? colors.indigo : colors.red;
  const changeSymbol = isPositive ? "↗" : "↘";

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/avatar.png")} // Remplace par l'URL de l'image ou le chemin local
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={[textStyles.body, styles.userName]}>{user.name}</Text>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>Rang: {user.rank}</Text>
          {/* Vous pouvez ajouter d'autres éléments ici si nécessaire */}
        </View>

      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.amount}>{user.amount} €</Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.change, { color: changeColor }]}>
            {changeSymbol} {variationRateAbs}%
          </Text>
        </View>
      </View>
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacings.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: spacings.corner.small,
    marginRight: spacings.spacing.small,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: colors.black1,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rank: {
    marginRight: spacings.spacing.small,
    color: colors.black2,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
    color: colors.black2,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    marginLeft: 4,
  },
  variationRate: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default RankItem;
