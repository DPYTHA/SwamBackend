import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const LivreurScreen = ({ token }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [commande, setCommande] = useState(null);
  const [disponible, setDisponible] = useState(false);

  const navigation = useNavigation();

  // ✅ Recherche commande
  const chercherCommande = async () => {
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
   /*deconnexion vers login en supprimant le token*/
   const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    navigation.navigate('Home'); 
  };

  // ✅ Fonction séparée pour la requête PUT
  const mettreAJourDisponibilite = async (nouvelEtat) => {
    const livreurId = await SecureStore.getItemAsync('livreurId');
    if (!livreurId) {
      console.warn("⚠️ livreurId manquant dans SecureStore");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.6:5000/api/livreur/${livreurId}/disponibilite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Si ton endpoint l’exige
        },
        body: JSON.stringify({ disponible: nouvelEtat }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      Alert.alert("Succès", data.message || "État mis à jour");
    } catch (err) {
      console.error("❌ PUT erreur :", err);
      Alert.alert("Erreur", err.message);
      setDisponible(!nouvelEtat); // rollback visuel
    }
  };

  // ✅ Toggle wrapper
  const toggleDisponibilite = () => {
    const nouvelEtat = !disponible;
    setDisponible(nouvelEtat);
    mettreAJourDisponibilite(nouvelEtat);
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => { handleLogout(); }}>
        <Ionicons name="log-out-outline" size={24} color="orangered" />
      </TouchableOpacity>
      <Text style={styles.title}>🔍 Suivi de commande</Text>

      <TextInput
        style={styles.input}
        placeholder="Entrer le tracking code"
        value={trackingCode}
        onChangeText={setTrackingCode}
      />

      <Button title="Rechercher" color="#eb6e38" onPress={chercherCommande} />

      {commande && (
        <View style={styles.commandeBox}>
          <Text style={styles.text}>Départ: {commande.depart}</Text>
          <Text style={styles.text}>Arrivée: {commande.arrivee}</Text>
          <Text style={styles.text}>Produits: {commande.produits}</Text>
          <Text style={styles.text}>Montant: {commande.montant_total} FCFA</Text>
        </View>
      )}

      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={styles.title}>📡 Ma disponibilité</Text>
        <View style={styles.switchRow}>
          <Text style={styles.text}>Je suis disponible</Text>
          <Switch value={disponible} onValueChange={toggleDisponibilite} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eb6e38',
    marginVertical: 15,
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    padding: 12,
    marginBottom: 10,
  },
  commandeBox: {
    marginTop: 20,
    backgroundColor: '#fbe9e7',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
});

export default LivreurScreen;
