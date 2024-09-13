import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importer le hook de navigation
import Button from '../components/button'; // Assurez-vous que ce composant existe
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import d'AsyncStorage
import colors from '../config-colors';
import textStyles from '../config-texts';
import axios from 'axios';
import useState from 'react';

function HomeScreen() {
  const navigation = useNavigation(); // Utiliser le hook pour accéder à la navigation

  // Fonction pour gérer la connexion à un fond ou la création d'un fond
  const handlePress = async (targetScreen) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
      if (!token) {
        navigation.navigate('Signup');
        return;
      }
      const response = await axios.get("https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/get", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
      });
      if (response.status == 200) {
        navigation.navigate(targetScreen); // Naviguer vers l'écran cible
      } else {
        navigation.navigate("home"); // Naviguer vers l'écran cible
      }
    } catch (error) {
      console.error('Erreur lors de la requête GET', error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={textStyles.heading1}>Le boursicoteur</Text>
      <Button 
        type="primary" 
        title="Rejoindre un fond" 
        iconName="arrow-forward" 
        onPress={() => handlePress('JoinGame')}  // Passer l'écran cible comme argument
      />
      <Button 
        type="secondary" 
        title="Créer un fond" 
        iconName="arrow-forward" 
        onPress={() => handlePress('CreateGame')}  // Passer l'écran cible comme argument
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey1,
    padding: 20,
  },
});

export default HomeScreen;
