import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Button from '../../components/button';
import colors from '../../config-colors'; 
import textStyles from '../../config-texts';
import configSpacing from '../../config-spacing';
import InfoBanner from '../../components/info';
import ListItem from '../../components/listItem';
import SkeletonLoader from '../../components/skeletonLoader';
import spacings from '../../config-spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WaitingRoom() {
  const navigation = useNavigation(); 
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState([]);
  const [gameData, setGameData] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setGameData(data.game || {});
      setIsOwner(data.owner); 
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      setLoading(false);
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
        navigation.navigate('Fonds');
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
      {loading ? (
        <View style={{ marginLeft: spacings.spacing.medium, marginTop: 0 }}>
          <SkeletonLoader width={270} height={40} borderRadius={16} />
          <SkeletonLoader width={300} height={120} borderRadius={16} />
          <SkeletonLoader width={320} height={40} borderRadius={16} />
          <SkeletonLoader width={300} height={80} borderRadius={16} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <ScrollView 
            style={{ paddingHorizontal: spacings.spacing.medium, backgroundColor: colors.grey1 }}
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
          </ScrollView>
          <View style={styles.pinContainer}>
            <Text style={textStyles.pinText}>PIN</Text>
            <View style={styles.pinBox}>
              {typeof gameData.pin === 'number' ? gameData.pin.toString().split('').map((char, index) => (
                <View key={index} style={styles.pinCharacterBox}>
                  <Text style={textStyles.heading2}>{char}</Text>
                </View>
              )) : <Text style={textStyles.heading1}>Aucun PIN disponible</Text>}
            </View>
          </View>
          {isOwner? (
            <View style={{marginHorizontal: spacings.spacing.medium, marginBottom: spacings.spacing.small}}>
            <Button 
              type="primary" 
              title="Lancer le fond" 
              iconName="arrow-forward" 
              onPress={startGame} 
              style={styles.button}
            />
            </View>
          ) : (
            <View style={{marginHorizontal: spacings.spacing.medium, marginBottom: spacings.spacing.small}}>
            <Button 
              type="secondary" 
              title="Attente de l'hôte" 
              iconName="arrow-forward" 
              style={styles.button}
            />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pinContainer: {
    marginBottom: configSpacing.spacing.medium,
    alignItems: 'center',
  },
  pinBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  pinCharacterBox: {
    width: 50,
    height: 50,
    borderRadius: configSpacing.corner.medium,
    backgroundColor: colors.grey2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  pinCharacter: {
    ...textStyles.heading2,
    color: colors.primary,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    
    borderRadius: 10, 
  },
});

export default WaitingRoom;