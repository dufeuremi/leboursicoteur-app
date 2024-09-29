import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import configColors from '../config-colors';
import configSpacing from '../config-spacing';

const AmountInput = ({ placeholder, capitalize, secureTextEntry, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={configColors.grey4}
        autoCapitalize={capitalize}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric" // Vous pouvez le changer en "numeric" si nécessaire
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: configSpacing.spacing.small,
    paddingBottom: configSpacing.spacing.small,
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: configSpacing.corner.medium,
    backgroundColor: configColors.grey2,
    paddingHorizontal: 15,
    color: configColors.black2,
    fontSize: 18,
    fontFamily: 'Shippori Antique Regular',
  },
});

export default AmountInput;
