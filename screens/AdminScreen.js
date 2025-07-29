import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Modal, TextInput
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = 'http://192.168.1.6:5000';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commandeEnCours, setCommandeEnCours] = useState(null);
  const [formData, setFormData] = useState({
    depart: '',
    arrivee: '',
    tracking_code: '',
    montant_colis: '',
    frais: '',
    statut: '',
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Erreur chargement utilisateurs', err);
    }
  };

  const fetchCommandes = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const res = await axios.get(`${BACKEND_URL}/admin/commandes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommandes(res.data.commandes || []);
    } catch (err) {
      console.error('❌ Erreur chargement commandes', err.response?.data || err.message);
    }
  };

  const toggleDispo = async (userId, currentState) => {
    try {
      await axios.put(`${BACKEND_URL}/api/livreur/${userId}/disponibilite`, {
        disponible: !currentState,
      });
      fetchUsers();
    } catch (err) {
      console.error('❌ Erreur mise à jour dispo', err);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    navigation.navigate('Home');
  };

  const openEditModal = (commande) => {
    setCommandeEnCours(commande);
    setFormData({
      depart: commande.depart || '',
      arrivee: commande.arrivee || '',
      tracking_code: commande.tracking_code || '',
      montant_colis: commande.montant_colis != null ? commande.montant_colis.toString() : '',
      frais: commande.frais != null ? commande.frais.toString() : '',
      statut: commande.statut != null ? commande.statut.toString() : '',
    });
    setModalVisible(true);
  };

  const modifierCommande = async () => {
    try {
      if (!commandeEnCours?.id) {
        console.error("❌ commandeEnCours.id est manquant");
        return;
      }

      const token = await SecureStore.getItemAsync('access_token');

      await axios.put(`${BACKEND_URL}/admin/commandes/${commandeEnCours.id}`, {
        ...formData,
        montant_colis: parseFloat(formData.montant_colis),
        frais: parseFloat(formData.frais),
        statut: parseInt(formData.statut),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Commande modifiée avec succès");
      setModalVisible(false);
      fetchCommandes();

    } catch (error) {
      console.error('❌ Erreur modification:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCommandes();
  }, []);

  // Filtrage pour éviter erreurs "toString" si id manquant
  const filteredUsers = users.filter(u => u && u.id != null);
  const filteredCommandes = commandes.filter(c => c && c.id != null);

  return (
    <ScrollView style={styles.container}>

      {/* Bouton Mes Chats */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('AdminChat')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        <Text style={styles.chatButtonText}>Mes Chats</Text>
      </TouchableOpacity>

      {/* Bouton Logout */}
      <TouchableOpacity onPress={handleLogout} style={{ position: 'absolute', top: 50, right: 30 }}>
        <Ionicons name="log-out-outline" size={24} color="red" />
      </TouchableOpacity>

      {/* Bouton Refresh */}
      <TouchableOpacity
        onPress={() => {
          fetchUsers();
          fetchCommandes();
        }}
        style={[styles.button, { backgroundColor: '#3498db', marginBottom: 20 }]}
      >
        <Text style={styles.buttonText}>🔄 Rafraîchir</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📊 Dashboard Admin</Text>

      <Text style={styles.sectionTitle}>👥 Utilisateurs</Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.username} - {item.role}</Text>
            {item.role === 'livreur' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: item.disponible ? 'green' : 'grey' }]}
                onPress={() => toggleDispo(item.id, item.disponible)}
              >
                <Text style={styles.buttonText}>
                  {item.disponible ? '✅ Disponible' : '⛔️ Indisponible'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>📦 Commandes</Text>
      <FlatList
        data={filteredCommandes}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Code: {item.tracking_code}</Text>
            <Text>De: {item.depart}</Text>
            <Text>À: {item.arrivee}</Text>
            <Text>Montant du colis: {item.montant_colis} </Text>
            <Text>Frais de Livraison: {item.frais} </Text>
            <Text>Statut: {item.statut}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4CAF50', marginTop: 8 }]}
              onPress={() => openEditModal(item)}
            >
              <Text style={styles.buttonText}>✏️ Modifier</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal Édition */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>✍️ Modifier la commande</Text>

          {['depart', 'arrivee', 'tracking_code', 'montant_colis', 'frais', 'statut'].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field}
              value={formData[field]}
              onChangeText={(text) => setFormData({ ...formData, [field]: text })}
              keyboardType={field === 'statut' ? 'numeric' : 'default'}
            />
          ))}

          <TouchableOpacity style={styles.button} onPress={modifierCommande}>
            <Text style={styles.buttonText}>✅ Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: 'gray' }]} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>❌ Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 60, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: {
    backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 10,
  },
  button: {
    marginTop: 8, padding: 10, borderRadius: 6, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  modalContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
