import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import d'AsyncStorage
import ProgressBar from '../../components/progressBar';
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button';
import CustomInput from '../../components/input';
import configColors from '../../config-colors';

export default function SignupStep4({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(1);

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

  const { color, text } = getStrengthColorAndText();

  // Fonction pour gérer l'envoi des données à l'API
  const handleSubmit = async () => {
    try {
      const prenom = await AsyncStorage.getItem('tempo-prenom');
      const nomdefamille = await AsyncStorage.getItem('tempo-nomdefamille');
      const email = await AsyncStorage.getItem('tempo-email');
      console.log(prenom);
      console.log(nomdefamille);
      console.log(email);
      console.log(password);
      if (!prenom || !nomdefamille || !email || !password || password !== confirmPassword) {
        Alert.alert('Erreur', 'Veuillez vérifier que tous les champs sont correctement remplis.');
        return;
      }
      const response = await fetch('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: prenom,
          lastname: nomdefamille,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', result.token); // Stocker le token
        navigation.navigate('Home'); // Rediriger vers la page d'accueil
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <View>
      <ProgressBar currentStep={4} totalSteps={5} color={configColors.indigo} />
      <View style={configComponent.backgroundCentredItems}>
        <Text style={textStyles.heading1}>Crée un mot de passe</Text>
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
        <View style={{ marginVertical: 4, marginHorizontal: 10 }}>
          <ProgressBar
            currentStep={passwordStrength}
            totalSteps={4}
            color={color}
            strengthText={text}
          />
        </View>
        <CustomInput
          placeholder="Confirmer le mot de passe"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <Button
          type="primary"
          title="Commencer"
          iconName="arrow-forward"
          onPress={handleSubmit} // Appel de la fonction pour gérer la soumission
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
