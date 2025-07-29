import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  

 const handleLogin = async () => {
  if (!phone || !password) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    return;
  }

  try {
    const response = await axios.post('http://192.168.1.5:5000/login', {
      telephone: phone,
      password: password,
    });

    const data = response.data;
    const { success, role, username, token, id } = data;

    if (success) {
      let prenom = '';
      let nom = '';
      if (username) {
        const parts = username.split(' ');
        prenom = parts[0] || '';
        nom = parts.slice(1).join(' ') || '';
      }

      await SecureStore.setItemAsync('prenom', prenom);
      await SecureStore.setItemAsync('nom', nom);
      await SecureStore.setItemAsync('phone', phone);
      await SecureStore.setItemAsync('access_token', token);
      await SecureStore.setItemAsync('user_id', id.toString());

       if (role === 'admin') {
        navigation.navigate('Admin');
      } else if (role === 'livreur') {
        await SecureStore.setItemAsync('livreurId', id.toString()); // ✅ corrige l'erreur
        navigation.navigate('Livreur');
      } else {
        navigation.navigate('Dashboard');
      }
    } else {
      Alert.alert('Erreur', data.message || 'Connexion échouée');
    }
  } catch (error) {
    Alert.alert('Erreur', 'Problème de connexion avec le serveur');
    console.error(error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas encore inscrit ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 },
  button: { backgroundColor: 'orangered', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  link: { color: 'black', marginTop: 20, textAlign: 'center' },
});
