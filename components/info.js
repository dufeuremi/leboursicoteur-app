import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors'; 
import configSpacing from '../config-spacing';
import textStyles from '../config-texts'; 

const InfoBanner = ({ text, iconType, background }) => {
  const iconName = iconType === 'time' ? 'time-outline' : 'information-circle-outline';

  return (
    <View style={[styles.container, !background && styles.noBackground]}>
      <Ionicons name={iconName} size={20} color={colors.black2} style={styles.icon} />
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey2,
    padding: configSpacing.spacing.small,
    borderRadius: configSpacing.corner.medium,
    marginBottom: 0,
  },
  
  noBackground: {
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: colors.black2,
    fontSize: 14,
    flex: 1,
  },
});

export default InfoBanner;
