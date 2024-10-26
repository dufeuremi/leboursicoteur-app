import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import colors from '../config-colors'; 
import spacings from '../config-spacing';
import GameCard from '../components/gameCard';  
import texts from '../config-texts';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import SkeletonLoader from '../components/skeletonLoader'; 
import Button from '../components/button';
import axios from 'axios';

const API_URL = 'https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/list';

function FondsScreen() {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleGamePress = async (game) => {
    try {
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
    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        setGames([]);  // Si pas de token, on s'assure de vider la liste de jeux
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
  
      // Vérifie que data.games est défini et est un tableau
      const allGames = [];
      console.log(data);
  
      if (Array.isArray(data.games)) {
        data.games.forEach(gameArray => {
          const game = gameArray.length > 0 ? gameArray[0] : null;
  
          if (game) {
            const participants = calculateParticipants(data.numb, game.id);
            allGames.push({ ...game, participants });
          }
        });
      } else {
        console.error("data.games n'est pas défini ou n'est pas un tableau");
      }
  
      setGames(allGames);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };


  const calculateParticipants = (numbArray, gameId) => {
    if (numbArray && Array.isArray(numbArray)) {
      for (let i = 0; i < numbArray.length; i += 2) {
        if (numbArray[i] === gameId && i + 1 < numbArray.length) {
          return numbArray[i + 1];
        }
      }
    }
    return 0;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const handlePress = async (targetScreen) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Signup');
        return;
      }
      const response = await axios.get("https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/get", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
      });
      if (response.status == 200) {
        navigation.navigate(targetScreen);
      } else {
        navigation.navigate("home");
      }
    } catch (error) {
      console.error('Erreur lors de la requête GET', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <SkeletonLoader width={310} height={250} borderRadius={16} />
          <SkeletonLoader width={310} height={250} borderRadius={16} />
          <SkeletonLoader width={310} height={250} borderRadius={16} />
        </View>
      ) : ( 
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.subContainer}>
          {games.length > 0 ? (
            games.map((game, index) => (
              <GameCard key={`${game.id}-${index}`} game={game} participantss={game.participants} onPress={() => handleGamePress(game)} />
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../assets/wallet.png')}
                style={{
                  width: 160,
                  height: 160,
                  shadowColor: colors.indigo,
                  marginTop: spacings.spacing.huge
                }}
              />
              <Text
                style={[
                  texts.body,
                  {
                    textAlign: 'center',
                    fontSize: 15,
                    marginBottom: 20,
                    marginHorizontal: spacings.spacing.large,
                    marginTop: spacings.spacing.medium,
                  },
                ]}
              >
                Commencez par créer ou rejoindre un fond.
              </Text>
            </View>
          )}
          </View>
        </ScrollView>
      )}

      <View style={styles.fixedButtonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            type="primary"
            title="Rejoindre"
            iconName="enter-outline"
            onPress={() => handlePress('JoinGame')}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            type="secondary"
            title="Créer"
            iconName="trending-up-outline"
            onPress={() => handlePress('CreateGame')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1,
    position: 'relative',
  },
  subContainer: {
    flex: 1,
    margin: spacings.spacing.medium
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacings.spacing.large
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: spacings.spacing.medium,
    right: spacings.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default FondsScreen;
