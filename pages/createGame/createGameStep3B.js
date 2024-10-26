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

export default function CreateGameStep3B({ navigation }) {
  const [gameCapital, setGameCapital] = useState(0); // État pour le capital du jeu

  // Fonction pour stocker le capital du jeu dans AsyncStorage
  const storeGameCapital = async () => {
    try {
      await AsyncStorage.setItem('game_fees', gameCapital); // Stocker le capital du jeu
      
      navigation.navigate('CreateGameStep5'); // Naviguer vers l'étape suivante
    } catch (e) {
      console.error('error', e);
    }
  };

  // Fonction pour gérer la modification de l'entrée et convertir les virgules en points
  const handleCapitalChange = (value) => {
    const formattedValue = value.replace(',', '.');
    setGameCapital(formattedValue);
  };

  return (
    <View>
      <ProgressBar currentStep={3} totalSteps={6} color={configColors.indigo}/>
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Définir les frais de transaction</Text>
        <InfoBanner text="Cela représente le coût de chaque achat et vente. Les frais sont habituellement de 0,10%." iconType="info" />

        <AmountInput 
          placeholder="Pourcentage %" 
          keyboard="digits" 
          capitalize="yes" 
          onChangeText={handleCapitalChange} // Utiliser la fonction qui convertit la valeur
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
