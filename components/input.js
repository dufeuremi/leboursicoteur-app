import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import configColors from '../config-colors';
import configSpacing from '../config-spacing';

const CustomInput = ({ placeholder, keyboardType, autoCapitalize, secureTextEntry, onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={configColors.grey4} 
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: configSpacing.spacing.small,
    paddingBottom: configSpacing.spacing.small,
    width: '100%' // External margin/padding
  },
  input: {
    height: 50,
    borderRadius: configSpacing.corner.medium, // Rounded corners
    backgroundColor: configColors.grey2, // Light purple background color
    paddingHorizontal: 15, // Internal padding
    color: configColors.black2, // Text color
    fontSize: 18, // Font size
    fontFamily: 'Shippori Antique Regular', // Make sure this font is available
  },
});

export default CustomInput;
