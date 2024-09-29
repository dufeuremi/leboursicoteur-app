import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage
import ProgressBar from '../../components/progressBar'; // Import du composant
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import CustomInput from '../../components/input';
import InfoBanner from '../../components/info';
import configColors from '../../config-colors';

export default function CreateGameStep2({ navigation }) {
  const [gameName, setGameName] = useState(''); // État pour le nom du jeu

  // Fonction pour stocker le nom du jeu dans AsyncStorage
  const storeGameName = async () => {
    try {
      await AsyncStorage.setItem('game_name', gameName); // Stocker le nom du jeu
      console.log('Nom du jeu sauvegardé avec succès');
      navigation.navigate('CreateGameStep3'); // Naviguer vers l'étape suivante
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du nom du jeu', e);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={2} totalSteps={6} color={configColors.indigo} />
      <View style={configComponent.background}>
        <Text style={textStyles.heading1}>Définir un nom</Text>
        <CustomInput 
          placeholder="Master 1 - Finance" 
          keyboard="text" 
          capitalize="true" 
          onChangeText={setGameName} // Mettre à jour le nom du jeu à chaque changement
        />
        <Button 
          type="primary" 
          title="Continuer" 
          iconName="arrow-forward" 
          onPress={storeGameName} // Appeler la fonction lors du clic
        />
      </View>
    </View>
  );
}
