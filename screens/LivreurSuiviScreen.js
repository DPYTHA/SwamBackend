import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function LivreurSuiviScreen({ route, navigation }) {
  // Sécuriser l'accès à route.params.commande
  const commande = route?.params?.commande;

  // Statut initial ou -1 si commande absente
  const [statut, setStatut] = useState(
    commande && typeof commande.statut === 'number' ? commande.statut : -1
  );

  // Fonction pour afficher le label du statut
  const getLabelStatut = () => {
    switch (statut) {
      case 0:
        return 'En attente';
      case 1:
        return 'En cours';
      case 2:
        return 'Livrée';
      default:
        return 'Inconnu';
    }
  };

  const prochainStatut = statut + 1;

  const changerEtat = async () => {
    if (!commande) {
      Alert.alert('Erreur', 'Aucune commande à mettre à jour.');
      return;
    }

    if (prochainStatut > 2) {
      Alert.alert('Info', 'Commande déjà livrée !');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant.');
        return;
      }

      const response = await fetch(
        `https://web-production-9c72c.up.railway.app/commande/${commande.id}/etat`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ etat: prochainStatut }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatut(prochainStatut);
        Alert.alert('Succès', `Commande maintenant : ${getLabelStatut()}`);
      } else {
        Alert.alert('Erreur', data.msg || 'Impossible de mettre à jour.');
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  if (!commande) {
    // Affiche un message ou redirige si commande manquante
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune commande reçue.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commande #{commande.id}</Text>
      <Text style={styles.label}>Code de suivi : {commande.tracking_code}</Text>
      <Text style={styles.label}>Départ : {commande.depart}</Text>
      <Text style={styles.label}>Arrivée : {commande.arrivee}</Text>
      <Text style={styles.label}>Statut actuel : {getLabelStatut()}</Text>

      {statut >= 0 && statut < 2 && (
        <TouchableOpacity style={styles.button} onPress={changerEtat}>
          <Text style={styles.buttonText}>
            Marquer comme {prochainStatut === 1 ? 'En cours' : 'Livrée'}
          </Text>
        </TouchableOpacity>
      )}

      {statut === 2 && (
        <Text style={styles.success}>✅ Commande livrée avec succès</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'orangered',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  success: {
    marginTop: 30,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
