import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
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
  const [loading, setLoading] = useState(true); // Ajouter un état pour le chargement

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
    setLoading(true); // Commencer le chargement
    try {
      const userToken = await AsyncStorage.getItem('userToken');
  
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
      const allGames = [];
      console.log(data);
  
      // Parcourir le tableau `games` dans la réponse
      data.games.forEach(gameArray => {
        const game = gameArray.length > 0 ? gameArray[0] : null;  // Vérifier si gameArray[0] existe
  
        if (game) {
          allGames.push(game);
        } else {
          console.error('gameArray est vide ou undefined:', gameArray);
        }
      });
  
      setGames(allGames);
    } catch (error) {

    } finally {
      setLoading(false); // Arrêter le chargement après la récupération des données
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);


  // Fonction pour gérer la connexion à un fond ou la création d'un fond
  const handlePress = async (targetScreen) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
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
        navigation.navigate(targetScreen); // Naviguer vers l'écran cible
      } else {
        navigation.navigate("home"); // Naviguer vers l'écran cible
      }
    } catch (error) {
      console.error('Erreur lors de la requête GET', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (  // Afficher SkeletonLoader pendant le chargement
        <View style={styles.loaderContainer}>
          <SkeletonLoader width={310} height={50} borderRadius={16} />
          <SkeletonLoader width={310} height={200} borderRadius={16} />
          <SkeletonLoader width={310} height={200} borderRadius={16} />
          <SkeletonLoader width={310} height={200} borderRadius={16} />
        </View>
      ) : ( 
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} // Ajout du padding pour éviter le chevauchement
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.subContainer}>
          {games.length > 0 ? (
  games.map((game, index) => (
    <GameCard key={`${game.id}-${index}`} game={game} onPress={() => handleGamePress(game)} />
  ))
) : (
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Image
    source={require('../assets/wallet.png')}
    style={{
      width: 120,
      height: 120,
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
    position: 'relative', // Assure que les éléments absolus sont positionnés par rapport à ce conteneur
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
    paddingBottom: 100, // Ajoute un padding en bas pour éviter que le contenu ne soit masqué par les boutons
  },
  fixedButtonContainer: {
    position: 'absolute', // Positionnement absolu
    bottom: 20, // Distance du bas de l'écran
    left: spacings.spacing.medium, // Distance du côté gauche
    right: spacings.spacing.medium, // Distance du côté droit
    flexDirection: 'row', // Aligne les enfants horizontalement
    justifyContent: 'space-between', // Espace entre les boutons
    // Ajoutez une ombre ou un fond si nécessaire pour améliorer la visibilité
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // padding: spacings.spacing.small,
    // borderRadius: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5, // Ajoute un petit espace entre les boutons
  },
});

export default FondsScreen;
