// DateTimePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../config-colors';
import config from '../config-spacing';
import textStyles from '../config-texts';

const DateTimePickerComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(true);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  return (
    <View style={styles.container}>
        <Text style={textStyles.heading2}>Se termine le</Text>
        <DateTimePicker style={{padding: 10}}
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: config.externalMargin.top,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'left',
    marginBottom: config.lineSpacing.loose,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black1,
    width: 100,
  },
  input: {
    backgroundColor: colors.grey2,
    borderRadius: config.corner.medium,
    padding: config.spacing.small,
    textAlign: 'left',
    marginHorizontal: config.spacing.small,
  },
});

export default DateTimePickerComponent;
