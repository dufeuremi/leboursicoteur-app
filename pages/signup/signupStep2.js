import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import d'AsyncStorage
import ProgressBar from '../../components/progressBar';
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button';
import CustomInput from '../../components/input';
import configColors from '../../config-colors';

export default function SignupStep2({ navigation }) {
  const [prenom, setPrenom] = useState('');  // État pour stocker le prénom

  // Fonction pour sauvegarder le prénom dans le cache
  const savePrenom = async () => {
    try {
      if (prenom) {
        await AsyncStorage.setItem('tempo-prenom', prenom);
        navigation.navigate('SignupStep3'); // Naviguer vers l'étape suivante après la sauvegarde
      } else {
        Alert.alert('Erreur', 'Veuillez entrer votre prénom.');  // Alerte si le champ est vide
      }
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du prénom', e);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={2} totalSteps={5} color={configColors.indigo} />
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Quel est ton prénom ?</Text>
        <CustomInput 
          placeholder="Prenom" 
          keyboard="default"  // Utilisation de 'default' pour un clavier texte
          capitalize="words"  // Capitalisation de la première lettre des mots
          value={prenom}      // Liaison avec l'état
          onChangeText={setPrenom}  // Met à jour l'état à chaque changement de texte
        />
        <Button 
          type="primary" 
          title="Continuer" 
          iconName="arrow-forward" 
          onPress={savePrenom}  // Appel de la fonction pour sauvegarder et naviguer
        />
      </View>
    </View>
  );
}
