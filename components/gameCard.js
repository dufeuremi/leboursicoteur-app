import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import spacings from "../config-spacing";
import texts from "../config-texts";
import configColors from '../config-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import Button from './button';

const GameCard = ({ game, onPress, participantss, onDelete }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [participants, setParticipants] = useState(0);
  
  const deleteButtonOpacity = useRef(new Animated.Value(0)).current; // Initialiser la valeur animée

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

  useEffect(() => {
    if (game.numb && Array.isArray(game.numb)) {
      let participantsCount = 0;
      for (let i = 0; i < game.numb.length; i++) {
        if (game.numb[i] === game.id && i + 1 < game.numb.length) {
          participantsCount = game.numb[i + 1];
          break;
        }
      }
      setParticipants(participantsCount);
    }
  }, [game.numb, game.id]);

  const renderRightActions = () => {
    // Démarrer l'animation avec easing 'ease-out' lorsque le bouton est visible
    Animated.timing(deleteButtonOpacity, {
      toValue: 1, // Final opacity value
      duration: 300,
      easing: Easing.out(Easing.ease), // Appliquer easing en sortie
      useNativeDriver: true, // Utiliser le driver natif pour de meilleures performances
    }).start();

    return (
      <Animated.View style={[styles.deleteButtonContainer, { opacity: deleteButtonOpacity }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={28} color="white" style={styles.deleteIcon} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={1}>

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
          {!isWaiting && !isExpired && (
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={18} color={configColors.black2} />
              <Text style={[styles.dynamicStatusText, { color: statusColor }]}>{timeRemaining}</Text>
            </View>
          )}
          <View style={styles.ratingContainer}>
            <Ionicons name="person-outline" size={18} color={configColors.black2} /> 
            <Text style={styles.ratingText}>{participantss}+</Text>
          </View>
        </View>
        <Button
          type="secondary"
          title={isWaiting ? "Salle d'attente" : "Situation & classement"}
          iconName={isWaiting ? "time-outline" : "document-text-outline"}
        />
      </TouchableOpacity>
    </Swipeable>
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
    alignItems: 'flex-start',
    marginBottom: spacings.spacing.medium,
    borderRadius: spacings.corner.medium
  },
  statusText2: {
    color: configColors.indigo,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: configColors.indigo,
    borderRadius: spacings.corner.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', marginBottom: spacings.spacing.medium,
    marginBottom: spacings.spacing.medium,
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
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end', // Alignement vers la droite de la carte
    marginBottom: spacings.spacing.small,
    width: "100%"
  },
  deleteButton: {
    backgroundColor: configColors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: spacings.corner.medium,
    paddingLeft: 220,
  },
  deleteIcon: {
    marginHorizontal: spacings.spacing.large, // Ajustez cette valeur pour contrôler la distance par rapport au bord droit
  },
  
});

export default GameCard;
