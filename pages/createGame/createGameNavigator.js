// navigators/SignupNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupStep1 from './createGameStep1';
import SignupStep2 from './createGameStep2';
import SignupStep3 from './createGameStep3';
import SignupStep3B from './createGameStep3B';
import SignupStep4 from './createGameStep4';
import SignupStep5 from './createGameStep5';
import colors from '../../config-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';

const Stack = createStackNavigator();

export default function CreateGameScreens() {
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
          height: 100,
          shadowOpacity: 0, // Retirer l'ombre sur iOS
            elevation: 0, // Retirer l'ombre sur Android
            borderBottomWidth: 0, // Retirer la bordure sur iOS
        },
      })}
    >
      <Stack.Screen name="CreateGameStep1" component={SignupStep1} options={{ title: 'Créer un fond' }} />
      <Stack.Screen name="CreateGameStep2" component={SignupStep2} options={{ title: 'Créer un fond' }} />
      <Stack.Screen name="CreateGameStep3" component={SignupStep3} options={{ title: 'Créer un fond' }} />
      <Stack.Screen name="CreateGameStep3B" component={SignupStep3B} options={{ title: 'Créer un fond' }} />
      <Stack.Screen name="CreateGameStep4" component={SignupStep4} options={{ title: 'Créer un fond' }} />
      <Stack.Screen name="CreateGameStep5" component={SignupStep5} options={{ title: 'Créer un fond' }} />

    </Stack.Navigator>

  );
}
