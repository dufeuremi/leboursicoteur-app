import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Button from '../../components/button';
import colors from '../../config-colors'; 
import textStyles from '../../config-texts';
import configSpacing from '../../config-spacing';
import InfoBanner from '../../components/info';
import ListItem from '../../components/listItem';
import spacings from '../../config-spacing';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WaitingRoom() {
  const navigation = useNavigation(); 
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const API_URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/get';
  const START_GAME_URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/start';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const selectedGameId = await AsyncStorage.getItem('selected_game_id'); 
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
          game_id: selectedGameId, 
        }),
      });
      const data = await response.json();
      setUserData(data.users);
      setGameData(data.game);
      setIsOwner(data.owner); 
      setRefreshing(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      setRefreshing(false);
    }
  };

  const startGame = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const selectedGameId = await AsyncStorage.getItem('selected_game_id');
      if (!userToken || !selectedGameId) {
        console.error('Token ou ID de jeu non trouvé dans le cache');
        return;
      }
  
      const response = await fetch(START_GAME_URL, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
        body: JSON.stringify({
          game_id: selectedGameId,
        }),
      });
  
      if (response.ok) {
        navigation.navigate('Game'); // Redirection vers l'écran "Game"
      } else {
        Alert.alert('Erreur', 'Impossible de démarrer le jeu');
      }
    } catch (error) {
      console.error('Erreur lors du démarrage du jeu :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du démarrage du jeu');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={{paddingHorizontal: spacings.spacing.medium, backgroundColor: colors.grey1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={textStyles.heading1}>Salle d'attente</Text>
        <InfoBanner text="Le fond d'investissement sera lancé par le boursicoteur hôte." />
        <View style={{ marginBottom: configSpacing.spacing.medium }} />
        <Text style={textStyles.heading2}>{userData.length} joueurs</Text>


        {userData.map((user, index) => (
          <ListItem 
            key={index} 
            user={{
              avatar: "../assets/avatar.png",
              name: `${user.firstname} ${user.lastname}`,
              email: user.email,
            }} 
          />
        ))}
        
        {isOwner && (
          <Button 
            type="primary" 
            title="Lancer le fond" 
            iconName="arrow-forward" 
            onPress={startGame} 
            style={styles.button}
          />
        )}
                <Text style={textStyles.heading1}>PIN: {gameData.pin}</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1,
    justifyContent: 'flex-end', 
  },
  scrollViewContent: {
    padding: 20,
  },
  button: {
    position: 'fixed',
    bottom: 20,
    left: 20, 
    right: 20, 
    borderRadius: 10, 
  },
});

export default WaitingRoom;
