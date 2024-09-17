// Button.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors'; 
import configSpacing from '../config-spacing';

const Button = ({ type, title, iconName, onPress, disabled }) => {
  const handlePress = () => {

    onPress && onPress(); // Appelle la fonction onPress passée en props
  };

  const buttonStyle = [
    type === 'primary' ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabledButton,
  ];
  const textStyle = [
    type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
    disabled && styles.disabledButtonText,
  ];
  const iconStyle = [
    type === 'primary' ? styles.primaryIcon : styles.secondaryIcon,
    disabled && styles.disabledIcon,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={handlePress} 
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
      <Ionicons name={iconName} size={20} style={iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.indigo,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: configSpacing.corner.medium,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  secondaryButton: {
    backgroundColor: colors.grey3,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: configSpacing.corner.medium,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.grey1,
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  primaryIcon: {
    marginLeft: 10,
    color: colors.grey1,
  },
  secondaryIcon: {
    marginLeft: 10,
    color: colors.white,
  },
  disabledButton: {
    backgroundColor: colors.grey3,
  },
  disabledButtonText: {
    color: colors.grey2,
  },
  disabledIcon: {
    color: colors.grey2,
  },
});

export default Button;
