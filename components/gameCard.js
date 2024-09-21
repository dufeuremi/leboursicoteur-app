import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Changed to Ionicons
import spacings from "../config-spacing";
import texts from "../config-texts";
import configColors from '../config-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

const GameCard = ({ game, onPress }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  const now = moment();
  const isExpired = moment(game.finish_at).isBefore(now);
  const isWaiting = game.isWaiting;

  const statusColor = isWaiting
    ? configColors.waitingColor
    : isExpired
    ? configColors.expiredColor
    : configColors.inProgressColor;

  const statusText = isWaiting
    ? 'En attente'
    : isExpired
    ? 'Expiré'
    : 'En cours';

  const calculateTimeRemaining = (finishAt) => {
    const now = moment();
    const end = moment(finishAt);
    const duration = moment.duration(end.diff(now));

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${days}j • ${hours}h • ${minutes}min • ${seconds}s`;
  };

  useEffect(() => {
    if (!isWaiting && !isExpired) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(game.finish_at));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [game.finish_at, isWaiting, isExpired]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText2, { color: statusColor, borderColor: statusColor }]}>
          {statusText}
        </Text>
      </View>
      <View style={styles.header}>
        <Image 
          source={require('../assets/adaptive-icon.png')}          
          style={styles.avatar}
        />
        <Text style={styles.title}>{game.name}</Text>
      </View>
      <View style={styles.timeAndRatingContainer}>
        {/* Afficher le timer uniquement si l'état est "En cours" */}
        {!isWaiting && !isExpired && (
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={18} color={configColors.black2} />
            <Text style={[styles.dynamicStatusText, { color: statusColor }]}>{timeRemaining}</Text>
          </View>
        )}
        <View style={styles.ratingContainer}>
          <Ionicons name="person-outline" size={18} color={configColors.black2} /> 
          <Text style={styles.ratingText}>5p</Text>
        </View>
      </View>
      {/* Masquer le footer si l'état est "En attente" ou "Expiré" */}
      { !isWaiting && !isExpired && (
        <View style={styles.footer}>
          <View style={styles.itemContainer}>
            <Text style={styles.places}>1er</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.price}>{game.initial_amount.toFixed(2)} €</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: configColors.grey2,
    borderRadius: spacings.corner.medium,
    padding: spacings.spacing.medium,
    borderWidth: 0,
    width: "100%",
    marginBottom: spacings.spacing.small,
    overflow: "hidden",
    
  },
  statusContainer: {
    alignItems: 'flex-start', // Align to the start horizontally
    marginBottom: spacings.spacing.medium,
    borderRadius: spacings.corner.medium // Increased vertical spacing
  },
  statusText: {
    color: configColors.indigo,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: configColors.indigo,
    borderRadius: spacings.corner.small, // Ensures rounded corners
    ...texts.body, // Assuming you have a body text style
  },
  statusText2: {
    color: configColors.indigo,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: configColors.indigo,
    borderRadius: spacings.corner.small, // Ensures rounded corners
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.spacing.medium, // Increased vertical spacing
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: spacings.corner.small,
  },
  title: {
    ...texts.heading2,
    marginLeft: spacings.spacing.small,
    color: configColors.black1,
  },
  timeAndRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  dynamicStatusText: {
    marginLeft: spacings.lineSpacing.tight,
    ...texts.body,
    color: configColors.black1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacings.lineSpacing.tight,
    ...texts.body,
    color: configColors.black1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: spacings.spacing.medium, // Increased vertical spacing
  },
  itemContainer: {
    backgroundColor: configColors.grey3,
    paddingVertical: spacings.spacing.small,
    paddingHorizontal: spacings.spacing.medium,
    borderRadius: spacings.corner.small,
    marginRight: spacings.lineSpacing.tight, // Use marginRight for horizontal spacing
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...texts.bold,
    color: configColors.black1,
    fontSize: 18,
  },
  percentageText: {
    ...texts.caption,
    color: configColors.indigo,
    fontSize: 14,
    marginLeft: 5,
  },
  places: {
    ...texts.bold,
    color: configColors.black1,
    fontSize: 18,
  },
  placesText: {
    ...texts.caption,
    color: configColors.indigo,
    fontSize: 14,
    marginLeft: 5,
  },
});

export default GameCard;
