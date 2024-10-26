// Import necessary packages and configuration
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

const MarketBadge = ({ icon, value, percentageChange, amount, name }) => {
  // État pour le taux de variation
  const [variationRate, setVariationRate] = useState(0);
  const [variationRateAbs, setVariationRateAbs] = useState(0);

  // Référence pour stocker la valeur précédente de 'amount'
  const previousAmountRef = useRef(amount);

  useEffect(() => {
    const previousAmount = previousAmountRef.current;

    // Calculer le taux de variation
    if (previousAmount !== 0) { // Éviter la division par zéro
      const variation = ((amount - previousAmount) / previousAmount) * 100;
      setVariationRate(variation.toFixed(2)); // Limiter à 2 décimales
      setVariationRateAbs(Math.abs(variation).toFixed(2)); // Valeur absolue
    } else {
      setVariationRate(0);
      setVariationRateAbs(0);
    }

    // Mettre à jour la valeur précédente
    previousAmountRef.current = amount;
  }, [amount]);

  const imageMap = {
    'AC': require('../assets/Logos/AC.png'),
    'AI': require('../assets/Logos/AI.png'),
    'AIR': require('../assets/Logos/AIR.png'),
    'ATO': require('../assets/Logos/ATO.png'),
    'BN': require('../assets/Logos/BN.png'),
    'CA': require('../assets/Logos/CA.png'),
    'CAP': require('../assets/Logos/CAP.png'),
    'DG': require('../assets/Logos/DG.png'),
    'EL': require('../assets/Logos/EL.png'),
    'EN': require('../assets/Logos/EN.png'),
    'ENGI': require('../assets/Logos/ENGI.png'),
    'FP': require('../assets/Logos/FP.png'),
    'FR': require('../assets/Logos/FR.png'),
    'HO': require('../assets/Logos/HO.png'),
    'KER': require('../assets/Logos/KER.png'),
    'LHN': require('../assets/Logos/LHN.png'),
    'LI': require('../assets/Logos/LI.png'),
    'LR': require('../assets/Logos/LR.png'),
    'MC': require('../assets/Logos/MC.png'),
    'ML': require('../assets/Logos/ML.png'),
    'OR': require('../assets/Logos/OR.png'),
    'ORA': require('../assets/Logos/ORA.png'),
    'PUB': require('../assets/Logos/PUB.png'),
    'RI': require('../assets/Logos/RI.png'),
    'RMS': require('../assets/Logos/RMS.png'),
    'SAF': require('../assets/Logos/SAF.png'),
    'SAN': require('../assets/Logos/SAN.png'),
    'SG': require('../assets/Logos/SG.png'),
    'SGO': require('../assets/Logos/SGO.png'),
    'STM': require('../assets/Logos/STM.png'),
    'SU': require('../assets/Logos/SU.png'),
    'UL': require('../assets/Logos/UL.png'),
    'VIE': require('../assets/Logos/VIE.png'),
    'VIV': require('../assets/Logos/VIV.png'),
  };

  // Déterminez la couleur et l'icône de variation en fonction de la valeur
  const isPositive = parseFloat(variationRate) >= 0;
  const variationColor = isPositive ? colors.indigo : colors.red;
  const variationIcon = isPositive ? '↗' : '↘';

  return (
    <View style={styles.cont}>
    <View style={styles.container}>
      <Image source={imageMap[name] || require('../assets/avatar.png')} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      <View style={styles.extraInfoContainer}>
        <Text style={styles.amountText}>{amount} €</Text>
        <Text style={[styles.percentageChange, { color: variationColor }]}>
          {variationIcon} {variationRateAbs}%
        </Text>
      </View>
    </View>
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  cont:{
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacings.spacing.small,
    paddingVertical: spacings.spacing.small,
    borderRadius:spacings.corner.small,
    borderColor: colors.grey3,
    borderWidth: 0,
    borderBottomWidth: 1,
    marginBottom: 10,
    
  },
  icon: {
    width: 35, // Adjust the size as needed
    height: 35, // Adjust the size as needed
    marginRight: spacings.spacing.small,
    borderRadius: 5,
    resizeMode: 'contain', // Ensure the image fits well
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  valueText: {
    ...textStyles.body,
    fontWeight: 'bold',
    color: colors.black1,
  },
  percentageChange: {
    fontSize: 12,
    marginTop: 2,
  },
  variationRate: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  extraInfoContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: colors.black1,
    fontWeight: 'bold',
  },
  extraInfoText: {
    color: colors.black1,
    fontSize: 12,
  },
});

export default MarketBadge;
