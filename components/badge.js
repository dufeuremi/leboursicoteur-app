// Import necessary packages and configuration
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

// Define the component with props
const PositionBadge = ({ iconName, iconSize, iconColor, position, rank, drop }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text style={[textStyles.body, styles.positionText]}>{position}</Text>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{rank}</Text>
        <Text style={styles.dropText}>{drop}</Text>
      </View>
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey3,
    paddingHorizontal: spacings.spacing.medium,
    paddingVertical: spacings.spacing.small,
    borderRadius: spacings.corner.medium,
  },
  iconContainer: {
    marginRight: spacings.spacing.small,
  },
  positionText: {
    color: colors.black1,
    fontWeight: '600',
    flex: 1,
  },
  rankContainer: {
    alignItems: 'flex-end',
  },
  rankText: {
    color: colors.black1,
    fontWeight: '900',
  },
  dropText: {
    color: '#FF0000', // Red color for the dropped places text
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PositionBadge;
