

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import colors from '../config-colors'; 
import spacings from '../config-spacing';
import GameCard from '../components/gameCard';  // Assurez-vous que le chemin est correct
import texts from '../config-texts';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importer AsyncStorage

const API_URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/list';

function FondsScreen() {
  const navigation = useNavigation();
  const [gamesWaiting, setGamesWaiting] = useState([]);
  const [gamesInProgress, setGamesInProgress] = useState([]);
  const [gamesExpired, setGamesExpired] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleGamePress = async (game) => {
    try {
      // Sauvegarder l'ID du jeu sélectionné dans AsyncStorage en le convertissant en chaîne de caractères
      await AsyncStorage.setItem("selected_game_id", game.id.toString());
  
      console.log("Game ID saved successfully:", game.id);
    } catch (error) {
      console.error("Failed to save the game ID:", error);
    }
  
    if (game.isWaiting) {
      navigation.navigate('WaitingRoom');  // Redirige vers WaitingRoom si en attente
    } else {
      navigation.navigate('Game');  // Redirige vers Game si la partie a commencé
    }
  };

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.error('Token non trouvé dans le cache');
        return;
      }
  
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': userToken
        }
      });
      const data = await response.json();
  
      const now = moment();
      const waiting = [];
      const inProgress = [];
      const expired = [];
      console.log(data);
      // Parcourir le tableau `games` dans la réponse
      data.games.forEach(gameArray => {
        const game = gameArray[0];  // Accéder à l'élément unique de chaque tableau
        
        const finishAt = moment(game.finish_at);
        if (game.isWaiting) {
          waiting.push(game);
        } else if (finishAt.isBefore(now)) {
          expired.push(game);
        } else {
          inProgress.push(game);
        }
      });
  
      setGamesWaiting(waiting);
      setGamesInProgress(inProgress);
      setGamesExpired(expired);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.subContainer}>
          {/* Fonds en attente */}
          <Text style={texts.heading1}>Fonds en attente</Text>
          {gamesWaiting.length > 0 ? (
            gamesWaiting.map((game) => (
              <GameCard key={game.id} game={game} onPress={() => handleGamePress(game)} />
            ))
          ) : (
            <Text style={texts.body}>Aucun fond en attente.</Text>
          )}

          {/* Fonds en cours */}
          <Text style={texts.heading1}>Fonds en cours</Text>
          {gamesInProgress.length > 0 ? (
            gamesInProgress.map((game) => (
              <GameCard key={game.id} game={game} onPress={() => handleGamePress(game)} />
            ))
          ) : (
            <Text style={texts.body}>Aucun fond en cours.</Text>
          )}

          {/* Fonds expirés */}
          <Text style={texts.heading1}>Fonds expirés</Text>
          {gamesExpired.length > 0 ? (
            gamesExpired.map((game) => (
              <GameCard key={game.id} game={game} onPress={() => handleGamePress(game)} />
            ))
          ) : (
            <Text style={texts.body}>Aucun fond expiré.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1,
  },
  subContainer: {
    flex: 1,
    margin: spacings.spacing.medium
  },
});

export default FondsScreen;