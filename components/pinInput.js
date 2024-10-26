import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../config-colors';
import config from '../config-spacing';

const PinInput = ({ onPinEntered }) => {
  const [pin, setPin] = useState('');
  const pinLength = 5;

  const handleChange = (value) => {
    // Remplacer les virgules par des points
    const updatedValue = value.replace(',', '.');

    if (updatedValue.length <= pinLength) {
      setPin(updatedValue);
      
      // Si 5 chiffres sont entrés, on déclenche l'événement onPinEntered
      if (updatedValue.length === pinLength) {
        onPinEntered(updatedValue); // Appelle la fonction passée en prop
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.hiddenInput}
        value={pin}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={pinLength}
        autoFocus
      />
      <View style={styles.digitContainer}>
        {[...Array(pinLength)].map((_, i) => (
          <View key={i} style={styles.digitWrapper}>
            <TextInput
              style={styles.digit}
              value={pin[i] ? pin[i] : ''}
              editable={false}
              placeholder="-"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  digitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: config.externalMargin.top,
  },
  digitWrapper: {
    width: 57,
    height: 57,
    borderRadius: config.corner.medium,
    backgroundColor: colors.grey3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  digit: {
    fontSize: 18,
    color: colors.black1,
  },
});

export default PinInput;
