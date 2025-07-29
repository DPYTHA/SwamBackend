import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const LivreurScreen = ({ token }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [commande, setCommande] = useState(null);
  const navigation = useNavigation();

  const chercherCommande = async () => {
    Keyboard.dismiss();
    if (!trackingCode.trim()) return;

    try {
      const res = await fetch(`http://192.168.1.5:5000/commande/by-tracking-code/${trackingCode}`);
      const data = await res.json();

      if (res.ok) {
        setCommande(data.commande);
      } else {
        Alert.alert('Erreur', data.error || 'Commande introuvable');
        setCommande(null);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Problème de connexion');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suivi de Commande</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Zone de recherche */}
      <View style={styles.searchCard}>
        <Text style={styles.label}>Code de suivi</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le code ici"
          placeholderTextColor="#999"
          value={trackingCode}
          onChangeText={setTrackingCode}
        />
        <TouchableOpacity style={styles.button} onPress={chercherCommande}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {/* Résultat */}
      {commande && (
        <View style={styles.resultCard}>
          <Text style={styles.resultItem}><Text style={styles.bold}>Départ :</Text> {commande.depart}</Text>
          <Text style={styles.resultItem}><Text style={styles.bold}>Arrivée :</Text> {commande.arrivee}</Text>
          <Text style={styles.resultItem}><Text style={styles.bold}>Produits :</Text> {commande.produits}</Text>
          <Text style={styles.resultItem}><Text style={styles.bold}>Montant :</Text> {commande.montant_total} FCFA</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eb6e38',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#eb6e38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#ffe8e0',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  resultItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default LivreurScreen;
