// Import necessary packages and configuration
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

// Define the component with props
const StockLogo = ({ name }) => {
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

  return (
    <View style={styles.container}>
      <Image source={imageMap[name]} style={styles.icon} />
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {

  },
  icon: {
    width: 35, // Adjust the size as needed
    height: 35, // Adjust the size as needed
    marginRight: spacings.spacing.small,
    borderRadius: 7,
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
    color: colors.red, // Assuming red color for negative change
    fontSize: 12,
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

export default StockLogo;
