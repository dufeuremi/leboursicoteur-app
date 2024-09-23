import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../components/progressBar';
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button';
import CustomInput from '../../components/input';
import configColors from '../../config-colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupStep2B({ navigation }) {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(1);
  const [email, setEmail] = useState('');

  // Récupération de l'email depuis le cache au montage du composant
  useEffect(() => {
    const fetchEmailFromCache = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('tempo-email');
        if (storedEmail) {
          setEmail(storedEmail);
        } else {
          Alert.alert('Erreur', 'Email non trouvé dans le cache.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'email:', error);
      }
    };
    fetchEmailFromCache();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 1;
    if (password.length > 5) strength++;
    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    evaluatePasswordStrength(text);
  };

  const getStrengthColorAndText = () => {
    switch (passwordStrength) {
      case 1:
        return { color: configColors.red, text: 'Faible' };
      case 2:
        return { color: configColors.red, text: 'Moyen' };
      case 3:
        return { color: configColors.green, text: 'Fort' };
      case 4:
        return { color: configColors.green, text: 'Très fort' };
      default:
        return { color: configColors.red, text: 'Faible' };
    }
  };

  const handleLogin = async () => {
    console.log(email);
    console.log(password);
    try {
      // Requête POST à l'API pour le login
      const response = await axios.post('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/login', {
        email: email,
        password: password,
      });
  
      // Si le login réussit, stocke le token dans le cache
      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
  
      // Redirection vers la page d'accueil
      navigation.navigate('Fonds');
      
    } catch (error) {
      // Vérification des erreurs de réponse
      if (error.response && error.response.status != 200) {
        // Erreur spécifique pour un mot de passe incorrect
        Alert.alert('Erreur', 'Mot de passe incorrect');
      } else {
        // Erreur générale
        Alert.alert('Erreur', 'Échec de la connexion. Veuillez vérifier vos informations.');
      }
      console.error('Erreur lors de la connexion:', error);
    }
  };
  

  const { color, text } = getStrengthColorAndText();

  return (
    <View>
      <ProgressBar currentStep={4} totalSteps={5} color={configColors.indigo} />
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Entre ton mot de passe</Text>
        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Mot de passe"
            secureTextEntry={!isPasswordVisible}
            onChangeText={handlePasswordChange}
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={configColors.grey4}
            />
          </TouchableOpacity>
        </View>
        <Button
          type="primary"
          title="Se connecter"
          iconName="arrow-forward"
          onPress={handleLogin}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: -30,
  },
});
