import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';


const PanierScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [panier, setPanier] = useState(route.params?.panier || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [adresseModalVisible, setAdresseModalVisible] = useState(false);
  const [adresse, setAdresse] = useState(null);
  const [distance, setDistance] = useState(0);

  const adressesDisponibles = [
    { label: "campement -> Pango 1, mosquée", value: 0.35 },
    { label: "campement -> Pango 1, église Assemblée de Dieu", value: 0.55 },
    { label: "campement -> Pango 1, Résidence egnehué", value: 0.75 },
    { label: "campement -> Pango 2, pharmacie", value: 0.5 },
    { label: "campement -> Pango 2, atelier espoir", value: 0.5 },
    { label: "campement -> Pango 2, chez Mr Akalo", value: 0.5 },
    { label: "campement -> Epkouzan, assinie lodge", value: 0.16 },
    { label: "campement -> Epkouzan, Milan hôtel sominou", value: 0.2 },
    { label: "campement -> Donwahi, Epp KPMG", value: 0.35 },
    { label: "campement -> Donwahi, Essouman hôtel", value: 0.5 },
    { label: "campement -> Donwahi, yamaman lodge", value: 0.75 },
    { label: "campement -> Voie principale, sodeci", value: 0.19 },
    { label: "campement -> Voie principale, cour royale", value: 0.45 },
    { label: "campement -> Voie principale, Quai du beach", value: 0.7 },
    { label: "campement -> Voie principale, pont", value: 1.6 },
    { label: "campement -> Voie principale, mairie", value: 0.95 },
    { label: "campement -> Voie principale, super marché", value: 0.5 },
    { label: "campement -> Zion, assinie beach club", value: 1.1 },
    { label: "campement -> Zion, agence Moov", value: 0.9 },
    { label: "campement -> Zion, maison ancien chef", value: 0.8 },
    { label: "campement -> Zion, palais bar", value: 0.7 },
    { label: "campement -> Zion hôtel", value: 13.5 },
    { label: "campement -> Voie du marché, au bord chez miss olga", value: 1.1 },
    { label: "campement -> Voie du marché, epp assinie 1A et 1B", value: 0.85 },
    { label: "campement -> Voie du marché, boulangerie", value: 0.75 },
    { label: "campement -> Voie du commissariat, commissariat", value: 0.65 },
    { label: "campement -> Voie du commissariat, cité des enseignants", value: 0.75 },
    { label: "campement -> Voie du commissariat, hôtel cool Mafia", value: 1.1 },
    { label: "campement -> Voie du dispensaire, dispensaire", value: 0.8 },
    { label: "campement -> Voie du dispensaire, hôtel sandrofia", value: 0.85 },
    { label: "campement -> Voie du dispensaire, église methodiste", value: 0.65 },
    { label: "campement -> Voie catholique, église catholique", value: 0.3 },
    { label: "campement -> Voie catholique, maternité", value: 0.6 },
    { label: "campement -> Sagbadou, boutique de Sagbadou", value: 1.2 },
    { label: "campement -> Sagbadou, cimetière", value: 1.3 },
    { label: "campement -> Sagbadou, tarpon", value: 1.2 },
    { label: "campement -> Alikro", value: 2.1 },
    { label: "campement -> Abissa lodge", value: 2.6 },
    { label: "campement -> Station", value: 4 },
    { label: "campement -> N'goakro", value: 4.7 },
    { label: "campement -> Carrefour Essankro", value: 5.5 },
    { label: "campement -> Biko lodge", value: 5.9 },
    { label: "campement -> Résidence djéne", value: 6 },
    { label: "campement -> Le sunshine lodge", value: 6.9 },
    { label: "campement -> Mykonos", value: 7.4 },
    { label: "campement -> L'escapade hôtel", value: 8.5 },
    { label: "campement -> Akoula kan lodge", value: 10 },
    { label: "campement -> Coucoué lodge", value: 13 },
    { label: "campement -> Marine de babihana", value: 13.1 },
    { label: "campement -> Le climbié d'assinie", value: 14.8 },
    { label: "campement -> Villa touraco", value: 15.6 },
    { label: "campement -> La maison d'Akoula", value: 15.6 },
    { label: "campement -> Villa akwaba", value: 15.9 },
    { label: "campement -> Elimah houses", value: 16.2 },
    { label: "campement -> Hôtel André Richard", value: 16.5 },
    { label: "campement -> Féline lodge", value: 17.3 },
    { label: "campement -> Hôtel le premier Assouindé", value: 18.1 },
    { label: "campement -> Notevia hôtel", value: 18.7 },
    { label: "campement -> Assinie beach hôtel", value: 18.9 }
  ];
const fraisLivraison = distance * 1000;

  const getTotalPlats = () => {
    return panier.reduce((total, item) => total + Number(item.prix || 0), 0);
  };

  const getTotalAvecLivraison = () => {
    return getTotalPlats() + fraisLivraison;
  };

 const commander = async () => {
  if (!adresse) {
    alert("Veuillez sélectionner une adresse de livraison.");
    return;
  }

  try {
    // Récupérer nom, prenom, phone et token depuis SecureStore
    const nom = await SecureStore.getItemAsync('nom');
    const prenom = await SecureStore.getItemAsync('prenom');
    const phone = await SecureStore.getItemAsync('phone');
    const token = await SecureStore.getItemAsync('access_token');

    if (!token) {
      alert('Vous devez être connecté pour passer une commande.');
      return;
    }

    // Construire payload commande
    const payload = {
      nom,
      prenom,
      phone,
      panier,
      adresse_livraison: adresse,
      frais_livraison: fraisLivraison,
      montant_total: getTotalAvecLivraison(),
      date_commande: new Date().toISOString(),
    };

    // Envoi au backend
  const response = await fetch('https://web-production-9c72c.up.railway.app/commandesResto', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
 body: JSON.stringify(payload),

});

 

    const data = await response.json();

    if (response.ok) {
      alert('Commande envoyée avec succès !');
      setAdresseModalVisible(false);
      navigation.goBack();
    } else {
      alert('Erreur lors de la commande : ' + (data.message || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Erreur lors de la commande:', error);
    alert('Erreur lors de la commande, veuillez réessayer.');
  }
};


  const supprimerPlat = (index) => {
    const newPanier = [...panier];
    newPanier.splice(index, 1);
    setPanier(newPanier);
  };

  const renderAdresseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adresseItem}
      onPress={() => {
        setAdresse(item.label);
        setDistance(item.value);
        setAdresseModalVisible(false);
      }}
    >
      <Text style={styles.adresseText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre Panier</Text>

      <FlatList
        data={panier}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.nom}</Text>
              <Text style={styles.itemDesc}>{item.composition}</Text>
              <Text style={styles.itemPrice}>{item.prix} FCFA</Text>
            </View>
            <TouchableOpacity onPress={() => supprimerPlat(index)}>
              <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total plats: {getTotalPlats()} FCFA</Text>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => setAdresseModalVisible(true)}
        >
          <Text style={styles.commandButtonText}>
            {adresse ? adresse : "Choisir adresse"}
          </Text>
        </TouchableOpacity>

        {distance > 0 && (
          <>
            <Text style={styles.fraisText}>
              Frais de livraison : {fraisLivraison} FCFA
            </Text>
            <Text style={styles.total}>
              Total à payer : {getTotalAvecLivraison()} FCFA
            </Text>
          </>
        )}

        <TouchableOpacity style={styles.validateButton} onPress={commander}>
          <Text style={{ color: 'white' }}>Valider la commande</Text>
        </TouchableOpacity>
      </View>

      {/* Modal liste des adresses */}
      <Modal visible={adresseModalVisible} animationType="slide" transparent>
        <View style={styles.adresseModalContainer}>
          <View style={styles.adresseModalContent}>
            <View style={styles.adresseModalHeader}>
              <Text style={styles.modalTitle}>Choisissez une adresse</Text>
              <Pressable onPress={() => setAdresseModalVisible(false)}>
                <Text style={{ color: 'orange', fontWeight: 'bold' }}>Fermer</Text>
              </Pressable>
            </View>

            <FlatList
              data={adressesDisponibles}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAdresseItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PanierScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemInfo: {
    flex: 1,
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  itemDesc: {
    fontSize: 14,
    color: 'gray',
  },
  itemPrice: {
    fontSize: 14,
    color: 'orange',
    marginTop: 5,
  },
  deleteButton: {
    fontSize: 22,
    color: 'red',
    paddingHorizontal: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: 'gray',
    paddingTop: 15,
    alignItems: 'center',
  },
  total: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  commandButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  commandButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fraisText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  validateButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  adresseModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  adresseModalContent: {
    backgroundColor: '#222',
    borderRadius: 10,
    maxHeight: '80%',
    padding: 10,
  },
  adresseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: 'orange',
    fontWeight: 'bold',
  },
  adresseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  adresseText: {
    color: 'white',
    fontSize: 16,
  },
});