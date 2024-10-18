// App.js
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import FondsScreen from './pages/fonds';
import SettingsScreen from './pages/profile';
import SignupNavigator from './pages/signup/signupNavigator';
import GameScreen from './pages/gameDetails';
import JoinGameScreen from './pages/join';
import CreateGameScreens from './pages/createGame/createGameNavigator';
import colors from './config-colors';
import WaitingRoom from './pages/waitingRoom/waitingNavigator';
import configSpacing from './config-spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.grey1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Fonds"
          screenOptions={({ navigation, route }) => ({
            headerLeft: route.name !== 'Fonds' ? () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ paddingLeft: configSpacing.spacing.medium }}
              >
                <Icon name="arrow-back" size={24} color={colors.black1} />
              </TouchableOpacity>
            ) : null,
            headerTitleAlign: route.name === 'Fonds' ? 'left' : 'center',
            headerTintColor: colors.black1,
            headerStyle: {
              backgroundColor: colors.grey1,
              height: 100,
              shadowOpacity: 0,
              elevation: 0,
              borderBottomWidth: 0,
            },
          })}
        >
          <Stack.Screen 
            name="Fonds" 
            component={FondsScreen} 
            options={({ navigation }) => ({
              title: "  Fonds d'investissement",
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem('userToken');
              
                    // Si le token est nul ou vide, redirige vers l'inscription
                    if (!token) {
                      console.log("Token inexistant. Redirection vers Signup.");
                      navigation.navigate('Signup');
                      return;
                    }
                    
                    const response = await axios.get("https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/get", {
                      headers: {
                        'Authorization': `Bearer ${token}`, // Ajout du Bearer
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      }
                    });
              
                    // Log pour voir le statut de la réponse et les données reçues
                    console.log('API Response status:', response.status);
                    console.log('API Response data:', response.data);
              
                    if (response.status === 200) { // Ajout d'une condition sur les données reçues
                      console.log("Token valide. Redirection vers Settings.");
                      navigation.navigate('Settings');
                    } else {
                      console.log("Token invalide ou erreur API. Redirection vers Signup.");
                      navigation.navigate('Signup');
                    }
                  } catch (error) {
                    console.log("Erreur lors de la requête API:", error.message);
                    console.log("Redirection vers Signup.");
                    navigation.navigate('Signup');
                  }
                }}
                style={{ paddingRight: configSpacing.spacing.medium }}
              >
                <Icon name="person-circle" size={29} color={colors.grey4} />
              </TouchableOpacity>
              

              ),
            })}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
              title: 'Profil',
              // Le bouton de déconnexion sera ajouté depuis le composant SettingsScreen
            }} 
          />
          <Stack.Screen name="Signup" component={SignupNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ title: '' }} />
          <Stack.Screen name="JoinGame" component={JoinGameScreen} options={{ title: 'Rejoindre une partie' }} />
          <Stack.Screen name="CreateGame" component={CreateGameScreens} options={{ headerShown: false }} />
          <Stack.Screen name="WaitingRoom" component={WaitingRoom} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
