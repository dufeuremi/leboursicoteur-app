import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage pour stocker et récupérer le token
import configComponent from '../config-component';
import textStyles from '../config-texts';
import PinInput from '../components/pinInput';
import InfoBanner from '../components/info';
import configColors from '../config-colors';

export default function JoinGameScreen({ navigation }) {
    const [loading, setLoading] = useState(false); // État pour gérer le chargement

    const handlePinEntered = async (pin) => {
        console.log('PIN Entered:', pin);

        setLoading(true);
  
        try {
            const userToken = await AsyncStorage.getItem('userToken');
  
            if (!userToken) {
                Alert.alert('Erreur', 'User token non disponible');
                setLoading(false);
                return;
            }
  
            const requestBody = {
                pin: pin,
            };
  
            const response = await fetch('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/game/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(requestBody),
            });
  
            const data = await response.json();
  
            if (response.ok) {
                navigation.navigate('Game');
            } else {
                Alert.alert('Erreur', 'Code pin invalide');
            }
  
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error);
            Alert.alert('Erreur', 'Impossible de joindre le jeu.');
        } finally {
            setLoading(false);
        }
    };
  

    return (
        <View>
            <View style={configComponent.background}>
                <Text style={textStyles.heading1}>Entrez le code PIN du fond d'investissement</Text>
                <InfoBanner text="Le code est visible sur l'appareil hôte" iconType="info"/>
                <SafeAreaView style={styles.container}>
                    <PinInput onPinEntered={handlePinEntered} loading={loading} /> 
                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: configColors.grey1,
    },
});
