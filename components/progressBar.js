import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import colors from '../config-colors';

const ProgressBar = ({ currentStep, totalSteps, color, strengthText }) => {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={null} // 'null' allows the bar to take the full width of the parent container
        color={color}
        unfilledColor={colors.grey2}
        borderWidth={0}
        height={4}
        borderRadius={0}
        style={styles.progressBar}
      />
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
