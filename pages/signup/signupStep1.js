import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import ProgressBar from '../../components/progressBar'; // Import du composant
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import CustomInput from '../../components/input';
import InfoBanner from '../../components/info';
import configColors from '../../config-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SignupStep1({ navigation }) {

  const URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/email';

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [data, setData] = useState(false);

  // Fonction de validation simplifiée de l'email
  const validateEmail = (email) => {
    return email.includes('@');
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    setIsEmailValid(validateEmail(input));
  };

  const handleContinue = async () => {
    try {
      const response = await axios.post(URL, { email: email });
      setData(response.data);
      
      // Vérification de l'existence du compte
      if (response.data.status == 'Compte inexistant') {
        // Navigue vers la prochaine étape d'inscription
        navigation.navigate('SignupStep2');
        // Enregistre l'email temporairement
        await AsyncStorage.setItem('tempo-email', email);
        await AsyncStorage.setItem('userEmail', email);
        // Ajoute également l'email dans create_account_email
        await AsyncStorage.setItem('create_account_email', email);
      } else {
        await AsyncStorage.setItem('tempo-email', email);
        navigation.navigate('SignupStep2B');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.', [{ text: 'OK' }]);
      console.error(error);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={1} totalSteps={5} color={configColors.indigo} />
      <View style={configComponent.background}>
        <Text style={textStyles.heading1}>Quelle est ton adresse email?</Text>
        <InfoBanner text="Si tu utilises Le Boursicoteur dans le cadre de ta formation, entre ton adresse email étudiante" iconType="info" />
        <CustomInput
          placeholder="nom.prenom@ecole.fr"
          keyboard="email-address"
          capitalize="none"
          keyboardType="email-address"
          onChangeText={handleEmailChange} // Met à jour l'email et vérifie la validité
          value={email}
          autoCapitalize="none"
        />
        <Button 
          type="primary" 
          title="Continuer" 
          iconName="arrow-forward" 
          onPress={handleContinue} 
        />
      </View>
    </View>
  );
}
