import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function EditProfileScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const nomStored = await SecureStore.getItemAsync('nom');
        const prenomStored = await SecureStore.getItemAsync('prenom');
        const phoneStored = await SecureStore.getItemAsync('phone');

        setNom(nomStored || '');
        setPrenom(prenomStored || '');
        setPhone(phoneStored || '');
      } catch (error) {
        console.error('Erreur chargement infos utilisateur:', error);
      }
    };

    loadUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        Alert.alert('Erreur', 'Token manquant');
        return;
      }

      const updatedUser = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        phone: phone.trim(),
        ...(password ? { password } : {}) // ajoute password uniquement s’il est modifié
      };

      const response = await fetch('https://web-production-9c72c.up.railway.app/update-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        // Mettre à jour localement
        await SecureStore.setItemAsync('nom', nom.trim());
        await SecureStore.setItemAsync('prenom', prenom.trim());
        await SecureStore.setItemAsync('phone', phone.trim());

        Alert.alert('Succès', 'Profil mis à jour avec succès');
        navigation.goBack();
      } else {
        const data = await response.json();
        Alert.alert('Erreur', data?.message || 'Mise à jour impossible');
      }
    } catch (error) {
      console.error('Erreur update:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Modifier mes informations</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />

        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe (optionnel)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Mettre à jour</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingTop: 100 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'orangered',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'orangered',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: {
    marginTop: 20,
    color: 'gray',
    textAlign: 'center',
  },
});
