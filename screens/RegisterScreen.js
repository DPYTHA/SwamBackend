import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const userData = {
      username: nom.trim() + ' ' + prenom.trim(),
      password: password,
      phone: phone.trim(),
    };

    try {
      const response = await axios.post('http://192.168.1.5:5000/register', userData, {
        timeout: 5000,
      });

      console.log('Inscription réussie :', response.data);
      alert('Inscription réussie ! Connecte-toi maintenant.');
      navigation.navigate('Login');
    } catch (error) {
      if (error.response) {
        console.error('Erreur réponse serveur:', error.response.status);
        console.error('Données renvoyées:', error.response.data);
        alert(`Erreur serveur: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request);
        alert("Aucune réponse du serveur. Vérifie ta connexion ou l'adresse du backend.");
      } else {
        console.error('Erreur lors de la requête:', error.message);
        alert(`Erreur lors de la requête: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={require('../assets/swamin_logo.png')} style={styles.logo} />
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: 'orangered',
    paddingTop: 100,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    width: 300,
    left: 30,
    borderColor: 'orange',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
  },
  button: {
    backgroundColor: 'orangered',
    padding: 15,
    width: 200,
    left: 90,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: 'black', marginTop: 20, textAlign: 'center' },
});
