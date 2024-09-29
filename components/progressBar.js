import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../config-colors';

const ProgressBar = ({ currentStep, totalSteps, color, strengthText }) => {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      {strengthText ? ( // Conditionally render the text only if strengthText is not null or empty
        <Text style={[styles.strengthText, { color: color,  textAlign: 'left',}]}>
          {strengthText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'left',
  },
  progressBar: {
    width: '100%',
  },
  strengthText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default ProgressBar;
