// Import necessary packages and configuration
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors';
import textStyles from '../config-texts';
import spacings from '../config-spacing';

const RankItem = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image 
          source={require( '../assets/avatar.png')} // Remplace par l'URL de l'image ou le chemin local
          style={styles.avatar}
    />
      <View style={styles.infoContainer}>
        <Text style={[textStyles.body, styles.userName]}>{user.name}</Text>
      </View>
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacings.spacing.small,
    borderBottomWidth: 2,
    borderBottomColor: colors.grey2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: spacings.corner.small,
    marginRight: spacings.spacing.medium,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: colors.black1
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    marginRight: spacings.spacing.small,
    color: colors.black2
  },
  points: {
    color: colors.indigo,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
    color: colors.black2
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    color: colors.indigo,
    marginLeft: 4,
  },
});

export default RankItem;
