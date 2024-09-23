// pages/SignupStep1.js
import React from 'react';
import { View, Text } from 'react-native';
import ProgressBar from '../../components/progressBar'; // Import du composant
import configComponent from '../../config-component';
import textStyles from '../../config-texts';
import Button from '../../components/button'; 
import CustomInput from '../../components/input';
import InfoBanner from '../../components/info';
import configColors from '../../config-colors';

export default function createGameStep1({ navigation }) {
  return (
    <View>
        <ProgressBar currentStep={1} totalSteps={6} color={configColors.indigo} />
        <View style={configComponent.background}>
            <Text style={textStyles.heading1}>Tu crée un fond dans le cadre...</Text>
            <Button 
                type="primary" 
                title="D’une partie entre amis" 
                iconName="people-outline" 
                onPress={() => navigation.navigate('CreateGameStep2')}
            />
            <Button 
                type="secondary" 
                title="D’un projet éducatif" 
                iconName="school-outline" 
                onPress={() => alert("Go to browser dashboard to create a game")}
            />
        </View>
    </View>
  );
}

