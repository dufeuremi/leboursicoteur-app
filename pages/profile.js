import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../config-colors';
import spacings from '../config-spacing';
import ProfileCard from '../components/profileCard';
import texts from '../config-texts';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour manipuler le cache
import { useNavigation } from '@react-navigation/native'; // Pour la navigation
import Button from '../components/button';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomInput from '../components/input';

function SettingsScreen() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null); // Référence pour le BottomSheet

  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });

  // Fonction pour récupérer les informations de l'utilisateur
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/auth/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération des données utilisateur');

      const data = await response.json();
      setUser({
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        email: data.user.email,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les informations utilisateur.');
    }
  };

  // Appel de la fonction fetchUserData au chargement du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fonction pour gérer la déconnexion
  const handleSignOut = async () => {
    try {
      // Suppression du token utilisateur
      await AsyncStorage.removeItem('userToken');

      // Affichage de l'alerte de succès
      Alert.alert('Succès', 'Vous êtes déconnecté avec succès.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'), // Redirection vers l'écran Home
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Fonction pour ouvrir le BottomSheet
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // Callback pour gérer les changements d'index du BottomSheet
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      bottomSheetRef.current?.close();
    }
  }, []);

  // Points d'arrêt pour le BottomSheet
  const snapPoints = useMemo(() => ['70%', '70%'], []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={texts.heading1}>Profil</Text>
        {/* Ajout du bouton de déconnexion */}
        <Icon
          name="exit-outline"
          size={24}
          color={colors.black1}
          style={styles.icon}
          onPress={handleSignOut} // Gestionnaire d'événement pour la déconnexion
        />
      </View>
      
      <ProfileCard 
        full_name={`${user.firstname} ${user.lastname}`} 
        email={user.email} 
      />
      
      <Button 
        type="secondary" 
        title="Modifier" 
        iconName="create-outline" 
        onPress={handleOpenBottomSheet} // Gestionnaire d'événement pour ouvrir le BottomSheet
      />

      {/* Ajout du BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Cacher initialement
        snapPoints={snapPoints}
        onChange={(index) => handleSheetChanges(index, bottomSheetRef)} // Gestionnaire d'événement pour les changements d'index
        enablePanDownToClose={true} // Permettre à l'utilisateur de fermer le BottomSheet en glissant vers le bas
      >
        <View style={styles.sheetContent}>
          <Text style={texts.heading2}>Modifier le profil</Text>
          
          {/* Conteneur pour les champs prénom et nom côte à côte */}
          <View style={styles.nameContainer}>
            <View style={styles.inputWrapper}>

              <CustomInput 
                placeholder="Prénom" 
                keyboard="text" 
                capitalize="true" 
                value={user.firstname} // Valeur du prénom
              />
            </View>
            <View style={styles.inputWrapper}>

              <CustomInput 
                placeholder="Nom" 
                keyboard="text" 
                capitalize="true" 
                value={user.lastname} // Valeur du nom
              />
            </View>
          </View>

          <CustomInput 
            placeholder="Email" 
            keyboard="text" 
            capitalize="true" 
            value={user.email} // Valeur de l'email
          />

          <Button 
            type="primary" 
            title="Enregistrer" 
            iconName="arrow-up-outline" 
            onPress={handleOpenBottomSheet} // Gestionnaire d'événement pour ouvrir le BottomSheet
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.grey1,
    paddingLeft: spacings.externalMargin.x,
    paddingTop: spacings.externalMargin.top,
    paddingRight: spacings.externalMargin.x,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    transform: [{ translateY: 40 }],
    paddingLeft: spacings.spacing.small,
  },
  sheetContent: {
    flex: 1,
    alignItems: 'flex-start',
    padding: spacings.spacing.medium,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '108%',
    marginTop: 40,
  },
  inputWrapper: {
    flex: 1,
    width: '102%',
    marginRight: "8%"
  },
});

export default SettingsScreen;
