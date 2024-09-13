import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import d'AsyncStorage
import ProgressBar from '../../components/progressBar';
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button';
import CustomInput from '../../components/input';
import configColors from '../../config-colors';

export default function SignupStep3({ navigation }) {
  const [nom, setNom] = useState('');  // État pour stocker le nom de famille

  // Fonction pour sauvegarder le nom dans le cache
  const saveNom = async () => {
    try {
      if (nom) {
        await AsyncStorage.setItem('tempo-nomdefamille', nom);
        navigation.navigate('SignupStep4'); // Naviguer vers l'étape suivante après la sauvegarde
      } else {
        Alert.alert('Erreur', 'Veuillez entrer votre nom de famille.');  // Alerte si le champ est vide
      }
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du nom', e);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={3} totalSteps={5} color={configColors.indigo} />
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Quel est ton nom ?</Text>
        <CustomInput 
          placeholder="Nom" 
          keyboard="default"  // Utilisation de 'default' pour un clavier texte
          capitalize="words"  // Capitalisation de la première lettre des mots
          value={nom}         // Liaison avec l'état
          onChangeText={setNom}  // Met à jour l'état à chaque changement de texte
        />
        <Button 
          type="primary" 
          title="Continuer" 
          iconName="arrow-forward" 
          onPress={saveNom}  // Appel de la fonction pour sauvegarder et naviguer
        />
      </View>
    </View>
  );
}
