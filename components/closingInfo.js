// InfoBanner.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors'; 
import configSpacing from '../config-spacing';

const ClosingInfo = ({ iconType }) => {
  const iconName = iconType === 'time' ? 'bar-chart-outline' : 'moon-outline';
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getParisTime = () => {
      const now = new Date();
      const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(now);
      const hourPart = parts.find(part => part.type === 'hour');
      const minutePart = parts.find(part => part.type === 'minute');
      return {
        hour: parseInt(hourPart.value, 10),
        minute: parseInt(minutePart.value, 10),
      };
    };

    const { hour: currentHour, minute: currentMinute } = getParisTime();

    const CLOSING_HOUR = 18; // 18h00 (heure de fermeture)
    const OPENING_HOUR = 9;  // 9h00 (heure d'ouverture)

    // Si la Bourse est fermée (après 18h ou avant 9h)
    if (currentHour >= CLOSING_HOUR || currentHour < OPENING_HOUR) {
      if (currentHour >= CLOSING_HOUR) {
        setMessage('La Bourse de Paris est actuellement clôturée. Elle ouvrira demain matin à 9h00.');
      } else if (currentHour < OPENING_HOUR) {
        setMessage('La Bourse de Paris est clôturée. Elle ouvrira ce matin à 9h00.');
      }
    } 
    // Si la Bourse est ouverte
    else {
      const hoursUntilClose = CLOSING_HOUR - currentHour - 1; // heures restantes avant 18h
      const minutesUntilClose = 60 - currentMinute; // minutes restantes avant l'heure suivante

      setMessage(`Clôture de la bourse de Paris dans ${hoursUntilClose} heure(s) et ${minutesUntilClose} minute(s).`);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={20} color={colors.black2} style={styles.icon} />
      <Text style={[styles.text, styles.highlight]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: configSpacing.spacing.small,
    borderRadius: configSpacing.corner.medium,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.indigo,
  },
  icon: {
    marginRight: 10,
    color: colors.indigo,
  },
  text: {
    color: colors.black2,
    fontSize: 14,
    flex: 1,
  },
  highlight: {
    color: colors.indigo, // Change the text color to indigo for the banner message
  },
});

export default ClosingInfo;
