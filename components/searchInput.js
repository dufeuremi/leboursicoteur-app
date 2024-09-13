import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import configColors from '../config-colors';
import configSpacing from '../config-spacing';

const SearchInput = ({ placeholder, keyboardType, autoCapitalize, secureTextEntry, onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={configColors.grey4} style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={configColors.grey4} 
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Aligne l'icône et le champ de texte en ligne
    alignItems: 'center', // Centre verticalement les éléments
    height: 50,
    borderRadius: configSpacing.corner.medium, // Coins arrondis
    backgroundColor: configColors.grey2, // Couleur de fond
    paddingHorizontal: 15, // Espace à l'intérieur du conteneur
    marginVertical: configSpacing.spacing.small

  },
  icon: {
    marginRight: 10, // Espace entre l'icône et le texte
  },
  input: {
    flex: 1, // Prend tout l'espace restant
    color: configColors.black2, // Couleur du texte
    fontSize: 18, // Taille de la police
    fontFamily: 'Shippori Antique Regular', // Assurez-vous que cette police est disponible
  },
});

export default SearchInput;
