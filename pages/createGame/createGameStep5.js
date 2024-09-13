import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage
import ProgressBar from '../../components/progressBar'; // Import du composant
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import InfoBanner from '../../components/info';
import configColors from '../../config-colors';
import DateTimePickerComponent from '../../components/datePicker';

export default function CreateGameStep5({ navigation }) {
  const [gameName, setGameName] = useState('');
  const [gameCapital, setGameCapital] = useState('');
  const [teamSize, setTeamSize] = useState(0);
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données du cache
        const name = await AsyncStorage.getItem('game_name');
        const capital = await AsyncStorage.getItem('game_capital');
        const size = await AsyncStorage.getItem('team_size');
        const token = await AsyncStorage.getItem('userToken');

        if (name) setGameName(name);
        if (capital) setGameCapital(capital);
        if (size) setTeamSize(Number(size));
        if (token) setUserToken(token);

      } catch (error) {
        console.error('Erreur lors de la récupération des données du cache', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateGame = async () => {
    const body = {
      name: gameName,
      finish_at: null,
      initial_amount: Number(gameCapital),
      team_sizes: teamSize,
    };

    console.log('Corps de la requête :', body);

    try {
      const response = await fetch('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken 
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log('Réponse de l\'API :', result);
      
      // Naviguer vers la salle d'attente ou une autre étape après la réussite
      navigation.navigate('Fonds');

    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  return (
    <View>
      <ProgressBar currentStep={5} totalSteps={6} color={configColors.indigo} />
      <View style={configComponent.background}>
        <Text style={textStyles.heading1}>Durée</Text>
        <InfoBanner text="Les dates de début et de fin sont modifiables par la suite" iconType="info"/>
        <DateTimePickerComponent />
        <Button 
          type="primary" 
          title="Créer le fond" 
          iconName="arrow-forward" 
          onPress={handleCreateGame} // Appeler la fonction lors du clic
        />
      </View>
    </View>
  );
}
