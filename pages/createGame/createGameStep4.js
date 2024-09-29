import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import configColors from '../../config-colors';

export default function CreateGameStep4({ navigation }) {
  
  // Fonction pour stocker le nombre de joueurs par équipe dans AsyncStorage
  const storeTeamSize = async (teamSize) => {
    try {
      await AsyncStorage.setItem('team_size', teamSize.toString()); // Stocker le nombre de joueurs
      console.log('Taille de l\'équipe sauvegardée avec succès');
      navigation.navigate('CreateGameStep5'); // Naviguer vers l'étape suivante
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la taille de l\'équipe', e);
    }
  };

  return (
    <View>
      <View style={configComponent.background}>
        <Text style={textStyles.heading1}>Jouez par équipe de...</Text>

        <Button 
          type="primary" 
          title="1 boursicoteur" 
          iconName="arrow-forward" 
          onPress={() => storeTeamSize(1)} // Stocker 1 joueur et passer à l'étape suivante
        />
        
        <Button 
          type="secondary" 
          title="2 boursicoteurs" 
          iconName="arrow-forward" 
          onPress={() => storeTeamSize(2)} // Stocker 2 joueurs et passer à l'étape suivante
        />
        
        <Button 
          type="secondary" 
          title="3 boursicoteurs" 
          iconName="arrow-forward" 
          onPress={() => storeTeamSize(3)} // Stocker 3 joueurs et passer à l'étape suivante
        />
      </View>
    </View>
  );
}
