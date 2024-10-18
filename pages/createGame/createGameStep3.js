import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage
import ProgressBar from '../../components/progressBar'; // Import du composant
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import CustomInput from '../../components/input';
import configColors from '../../config-colors';
import InfoBanner from '../../components/info';
import AmountInput from '../../components/amountInput';

export default function CreateGameStep3({ navigation }) {
  const [gameCapital, setGameCapital] = useState(0); // État pour le capital du jeu

  // Fonction pour stocker le capital du jeu dans AsyncStorage
  const storeGameCapital = async () => {
    try {
      await AsyncStorage.setItem('game_capital', gameCapital); // Stocker le capital du jeu
      
      navigation.navigate('CreateGameStep5'); // Naviguer vers l'étape suivante
    } catch (e) {
      console.error('GAME CAPITAL Erreur lors de la sauvegarde du capital du jeu', e);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={3} totalSteps={6} color={configColors.indigo}/>
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Quel est le capital de départ?</Text>
        <InfoBanner text="Le montant définira la somme initiale de la simulation, égale entre chaque participant" iconType="info" />

        <AmountInput 
          placeholder="Montant" 
          keyboard="digits" 
          capitalize="yes" 
          onChangeText={setGameCapital} // Mettre à jour l'état du capital à chaque modification
        />
        
        <Button 
          type="primary" 
          title="Continuer" 
          iconName="arrow-forward" 
          onPress={storeGameCapital} // Appeler la fonction lors du clic
        />
      </View>
    </View>
  );
}
