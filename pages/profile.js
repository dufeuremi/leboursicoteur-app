import React, { useRef, useMemo, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Utilisation des icônes d'Expo
import colors from '../config-colors';
import spacings from '../config-spacing';
import ProfileCard from '../components/profileCard';
import texts from '../config-texts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomInput from '../components/input';
import SkeletonLoader from '../components/skeletonLoader'; // Importation du SkeletonLoader

function SettingsScreen() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const [user, setUser] = useState({
    _boursicoteur_users_id: 0,
    firstname: '',
    lastname: '',
    email: '',
  });
  
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

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
        _boursicoteur_users_id: data.user._boursicoteur_users_id,
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        email: data.user.email,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les informations utilisateur.');
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Appel de la fonction fetchUserData au chargement du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fonction pour gérer la déconnexion
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Succès', 'Vous êtes déconnecté avec succès.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Fonds'),
        },
      ]);
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      Alert.alert('Erreur', 'Impossible de vous déconnecter.');
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
  const snapPoints = useMemo(() => ['70%'], []);

  // Fonction pour gérer l'enregistrement des modifications
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch('https://xmpt-xa8m-h6ai.n7c.xano.io/api:RMY1IHfK/_boursicoteur_users/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _boursicoteur_users_id: user._boursicoteur_users_id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
      }

      bottomSheetRef.current?.close();
      fetchUserData();
      Alert.alert('Succès', 'Votre profil a été mis à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil.');
    }
  };

  // Gestionnaires de changement pour les inputs
  const handleChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  // Configuration du header pour ajouter le bouton de déconnexion
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSignOut}
          style={{ paddingRight: spacings.spacing.medium }}
          accessibilityLabel="Déconnexion"
          accessible
        >
          <Ionicons name="exit-outline" size={24} color={colors.black1} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? ( // Afficher SkeletonLoader si les données sont en cours de chargement
        <View >
          <SkeletonLoader width={320} height={120} borderRadius={16} />
          <SkeletonLoader width={320} height={40} borderRadius={16} />
        </View>
      ) : (
        <>
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
            index={-1} // Initialement caché
            snapPoints={snapPoints}
            onChange={(index) => handleSheetChanges(index)} // Gestionnaire d'événement pour les changements d'index
            enablePanDownToClose={true} // Permettre à l'utilisateur de fermer le BottomSheet en glissant vers le bas
          >
            <View style={styles.sheetContent}>
              <Text style={texts.heading2}>Modifier le profil</Text>
              
              <View style={styles.nameContainer}>
                <View style={styles.inputWrapper}>
                  <CustomInput 
                    placeholder="Prénom" 
                    keyboard="default" 
                    capitalize="true" 
                    value={user.firstname} // Valeur du prénom
                    onChangeText={(text) => handleChange('firstname', text)} // Gestionnaire de changement
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <CustomInput 
                    placeholder="Nom" 
                    keyboard="default" 
                    capitalize="true" 
                    value={user.lastname} // Valeur du nom
                    onChangeText={(text) => handleChange('lastname', text)} // Gestionnaire de changement
                  />
                </View>
              </View>
              <CustomInput 
                placeholder="Email" 
                keyboard="email-address" 
                capitalize="false" 
                value={user.email} // Valeur de l'email
                onChangeText={(text) => handleChange('email', text)} // Gestionnaire de changement
              />

              <Button 
                type="primary" 
                title="Enregistrer" 
                iconName="arrow-up-outline" 
                onPress={handleSave} // Appel de la fonction d'enregistrement
              />
            </View>
          </BottomSheet>
        </>
      )}
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
    paddingRight: spacings.externalMargin.x,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacings.spacing.large,
  },
  sheetContent: {
    flex: 1,
    alignItems: 'flex-start',
    padding: spacings.spacing.medium,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  inputWrapper: {
    flex: 1,
    width: '100%',
    marginRight: '2%',
  },
});

export default SettingsScreen;
