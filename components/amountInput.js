import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import configColors from '../config-colors';
import configSpacing from '../config-spacing';

const AmountInput = ({ placeholder, keyboard, capitalize, secureTextEntrys }) => {
  const [value, setValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  const handleChange = (text) => {
    // Permet uniquement les chiffres, les points et les virgules
    const formattedValue = text.replace(/[^0-9.,]/g, '');

    // Remplace la première virgule ou point par un point (consistant)
    let cleanedValue = formattedValue.replace(/,/g, '.');

    // Si plusieurs séparateurs décimaux sont présents, ne garde que le premier
    const decimalParts = cleanedValue.split('.');
    if (decimalParts.length > 2) {
      cleanedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }

    setValue(cleanedValue);

    // Met à jour la position du curseur (avant le signe € si la valeur n'est pas vide)
    const cursorPos = cleanedValue.length;
    setCursorPosition({ start: cursorPos, end: cursorPos });
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        placeholderTextColor={configColors.grey4} 
        autoCapitalize={capitalize}
        secureTextEntry={secureTextEntrys}
        onChangeText={handleChange}
        value={value ? `${value} €` : ''} // Affiche la valeur avec le symbole € si non vide
        keyboardType="numeric"
        selection={cursorPosition} // Positionne le curseur
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: configSpacing.spacing.small,
    paddingBottom: configSpacing.spacing.small,
    width: '100%'
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
