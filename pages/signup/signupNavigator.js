// navigators/SignupNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupStep1 from './signupStep1';
import SignupStep2 from './signupStep2';
import SignupStep3 from './signupStep3';
import SignupStep4 from './signupStep4';
import signupStep2B from './signupStep2B';
import colors from '../../config-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../components/progressBar';
import { View } from 'react-native';

const Stack = createStackNavigator();

export default function SignupNavigator() {
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
      
      <Stack.Screen name="SignupStep1" component={SignupStep1} options={{ title: 'Identification' }} />
      <Stack.Screen name="SignupStep2" component={SignupStep2} options={{ title: 'Identification' }} />
      <Stack.Screen name="SignupStep3" component={SignupStep3} options={{ title: 'Identification' }} />
      <Stack.Screen name="SignupStep4" component={SignupStep4} options={{ title: 'Identification' }} />
      <Stack.Screen name="SignupStep2B" component={signupStep2B} options={{ title: 'Identification' }} />
    </Stack.Navigator>

  );
}
