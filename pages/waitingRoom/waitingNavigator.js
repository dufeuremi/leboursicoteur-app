import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import waitingStep from './waitingRoom';
import colors from '../../config-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../components/progressBar';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function WaitingNavigator() {

  const [gameData, setGameData] = useState(null);

  const API_URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/get';

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const selectedGameId = await AsyncStorage.getItem('selected_game_id'); // Récupération de l'ID du jeu depuis le cache

      if (!userToken || !selectedGameId) {
        console.error('Token ou ID de jeu non trouvé dans le cache');
        return;
      }
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          game_id: selectedGameId, // Utilisation de l'ID du jeu récupéré du cache
        }),
      });
      const data = await response.json();
      setGameData(data.game);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
            <Icon name="arrow-back" size={24} color={colors.black1} />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
        headerTintColor: colors.black1,
        headerStyle: {
          backgroundColor: colors.grey1,
          height: 75,
          shadowOpacity: 0, // Retirer l'ombre sur iOS
          elevation: 0, // Retirer l'ombre sur Android
          borderBottomWidth: 0, // Retirer la bordure sur iOS
        },
      })}
    >
      <Stack.Screen 
        name="wait" 
        component={waitingStep} 
        options={{ title: gameData ? gameData.name : '-' }} 
      />
    </Stack.Navigator>
  );
}
