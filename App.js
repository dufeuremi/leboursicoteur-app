// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import HomeScreen from './pages/home';
import FondsScreen from './pages/fonds';
import SettingsScreen from './pages/profile';
import SignupNavigator from './pages/signup/signupNavigator'; // Import du SignupNavigator
import GameScreen from './pages/gameDetails';
import JoinGameScreen from './pages/join';
import CreateGameScreens from './pages/createGame/createGameNavigator';
import colors from './config-colors';
import WaitingRoom from './pages/waitingRoom/waitingNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fonds') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Icon name={iconName} size={29} color={color} />;
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: colors.grey1,
          height: 56,
          borderTopWidth: 1.5,
          borderTopColor: colors.grey2,
        },
        tabBarActiveTintColor: colors.black1,
        tabBarInactiveTintColor: colors.grey3,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Fonds" component={FondsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer style={{ backgroundColor: colors.grey1 }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
              <Icon name="arrow-back" size={24} color={colors.black1} />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerTintColor: colors.black1,
          borderBottomWidth: 0,
          headerStyle: {
            backgroundColor: colors.grey1,
            height: 75,
            shadowOpacity: 0, // Retirer l'ombre sur iOS
            elevation: 0, // Retirer l'ombre sur Android
            borderBottomWidth: 0, // Retirer la bordure sur iOS
          },
        })}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: '' }}/>
        <Stack.Screen name="JoinGame" component={JoinGameScreen} options={{ title: 'Rejoindre une partie' }}/>
        <Stack.Screen name="CreateGame" component={CreateGameScreens} options={{ headerShown: false }}  />
        <Stack.Screen name="WaitingRoom" component={WaitingRoom} options={{ headerShown: false }}  />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
