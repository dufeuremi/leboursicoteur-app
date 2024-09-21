import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Utiliser Ionicons
import spacings from "../config-spacing";  // Met à jour le chemin d'import si nécessaire
import texts from "../config-texts";     
import configColors from '../config-colors';  // Met à jour le chemin d'import si nécessaire
import Button from './button';


const UserProfileCard = ({full_name, email}) => {

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image 
        source={require('../assets/avatar.png')}          
        style={styles.avatar}
        />
        <View style={styles.details}>
          <Text style={texts.bold}>{full_name}</Text>
          <View style={styles.emailContainer}>
            <Text style={texts.body}>{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: configColors.grey2,
    borderRadius: spacings.corner.medium,
    padding: spacings.spacing.medium,
    width: "100%",
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: spacings.corner.small,
    marginRight: spacings.spacing.small,

  },
  details: {
    flex: 1,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  email: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default UserProfileCard;
