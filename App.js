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
              title: "Fonds d'investissement",
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}
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
