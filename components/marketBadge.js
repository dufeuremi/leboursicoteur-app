// Import necessary packages and configuration
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

// Define the component with props
const MarketBadge = ({ icon, value, percentageChange, amount, extraInfo }) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.valueText}>{value}  </Text>

      </View>
      <View style={styles.extraInfoContainer}>
        <Text style={styles.amountText}>{amount} €</Text>
        <Text style={styles.percentageChange}> {percentageChange}</Text>
      </View>
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: spacings.spacing.small,
    paddingVertical: spacings.spacing.small,
    borderRadius: spacings.corner.medium,
    borderColor: colors.grey3,
    borderWidth: 1,
    marginBottom:  10,
  },
  icon: {
    width: 35, // Adjust the size as needed
    height: 35, // Adjust the size as needed
    marginRight: spacings.spacing.small,
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
    color: '#FF0000', // Assuming red color for negative change
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

export default MarketBadge;
