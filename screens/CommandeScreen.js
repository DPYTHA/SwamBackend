import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const adresses = [
  "Pango 1, mosquée", "Pango 1, église Assemblée de Dieu", "Pango 1, Résidence egnehué",
  "Pango 2, pharmacie", "Pango 2, atelier espoir", "Pango 2, chez Mr Akalo",
  "Epkouzan, assinie lodge", "Epkouzan, campement", "Epkouzan, Milan hôtel sominou",
  "Donwahi, Epp KPMG", "Donwahi, Essouman hôtel", "Donwahi, yamaman lodge",
  "Voie principale, sodeci", "Voie principale, cour royale", "Voie principale, Quai du beach",
  "Voie principale, pont", "Voie principale, mairie", "Voie principale, super marché",
  "Zion, assinie beach club", "Zion, agence Moov", "Zion, maison ancien chef",
  "Zion, palais bar", "Zion hôtel",
  "Voie du marché, au bord chez miss olga", "Voie du marché, epp assinie 1A et 1B", "Voie du marché, boulangerie",
  "Voie du commissariat, commissariat", "Voie du commissariat, cité des enseignants", "Voie du commissariat, hôtel cool Mafia",
  "Voie du dispensaire, dispensaire", "Voie du dispensaire, hôtel sandrofia", "Voie du dispensaire, église methodiste",
  "Voie catholique, église catholique", "Voie catholique, maternité",
  "Sagbadou, boutique de Sagbadou", "Sagbadou, cimetière", "Sagbadou, tarpon",
  "Alikro", "Abissa lodge", "Station", "N'goakro", "Carrefour Essankro", "Biko lodge", "Résidence djéne",
  "Le sunshine lodge", "Mykonos", "L'escapade hôtel", "Akoula kan lodge", "Nahiko hôtel", "Akwa beach", "Coucoué lodge",
  "Marine de babihana", "Le climbié d'assinie", "Villa touraco", "La maison d'Akoula", "Villa akwaba",
  "Elimah houses", "Hôtel André Richard", "Féline lodge", "Hôtel le premier Assouindé", "Notevia hôtel",
  "Assinie beach hôtel", "Rond point d'assouindé"
];

// Distances simplifiées (exemple)
const distances = {
  "Pango 1, mosquée->Pango 2, pharmacie": 5,
  "Pango 2, pharmacie->Epkouzan, assinie lodge": 8,
  // ajoute plus si besoin
};

function getDistanceKm(dep, arr) {
  if (dep === arr) return 0;
  return distances[`${dep}->${arr}`] || distances[`${arr}->${dep}`] || 2; // défaut 2 km
}

export default function CommandeForm({ navigation }) {
  const [typeCommande, setTypeCommande] = useState('');
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [produits, setProduits] = useState('');
  const [montantColis, setMontantColis] = useState('');
  const [frais, setFrais] = useState(null);
  const [montantTotal, setMontantTotal] = useState(null);

  // Modals pour sélection adresses
  const [modalDepartVisible, setModalDepartVisible] = useState(false);
  const [modalArriveeVisible, setModalArriveeVisible] = useState(false);

  useEffect(() => {
    if (depart && arrivee) {
      const km = getDistanceKm(depart, arrivee);
      let f = 0;
      let montantAchat = parseFloat(montantColis) || 0;

      if (typeCommande === 'achatLivraison') {
        f = 0.2 * montantAchat + 500 * km;
      } else if (typeCommande === 'livraisonSeule') {
        f = 500 * km;
      } 
      setFrais(Math.ceil(f));
      setMontantTotal(Math.ceil(f + montantAchat));
    } else {
      setFrais(null);
      setMontantTotal(null);
    }
  }, [typeCommande, depart, arrivee, montantColis]);

  function generateTrackingCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const code = letters.charAt(Math.floor(Math.random() * letters.length)) +
                 letters.charAt(Math.floor(Math.random() * letters.length)) +
                 numbers;
    return code;
  }

  async function handleSubmit() {
    if (!typeCommande) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de commande');
      return;
    }
    if (!depart || !arrivee) {
      Alert.alert('Erreur', 'Veuillez remplir les adresses de départ et d’arrivée');
      return;
    }
    if (!produits.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner les produits et contact');
      return;
    }

    const token = await SecureStore.getItemAsync('access_token');
    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour passer une commande.');
      return;
    }

    const trackingCode = generateTrackingCode();

    const commandeData = {
      type: typeCommande,
      depart: depart,
      arrivee: arrivee,
      produits: produits,
      montant_colis: montantColis,
      frais: frais,
      montant_total: montantTotal,
      tracking_code: trackingCode,
    };

    try {
      const response = await fetch("http://192.168.1.5:5000/commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <-- Ajout du token ici
        },
        body: JSON.stringify(commandeData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Commande enregistrée",
          `Code de suivi : ${trackingCode}\nMontant total à payer : ${montantTotal} FCFA`
        );
        navigation.navigate("Paiement", { ...commandeData });
      } else {
        console.error("Erreur backend :", data);
        Alert.alert("Erreur", data.message || "Échec de l'enregistrement de la commande.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  }

  function renderAdresseItem({ item }, onSelect) {
    return (
      <TouchableOpacity
        style={styles.adresseItem}
        onPress={() => {
          onSelect(item);
        }}
      >
        <Text style={{ fontSize: 16 }}>{item}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60' }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Passer une commande</Text>

          <Text style={styles.label}>Type de commande</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                typeCommande === 'achatLivraison' && styles.typeBtnActive,
              ]}
              onPress={() => setTypeCommande('achatLivraison')}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  typeCommande === 'achatLivraison' && styles.typeBtnTextActive,
                ]}
              >
                Achat & Livraison
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                typeCommande === 'livraisonSeule' && styles.typeBtnActive,
              ]}
              onPress={() => setTypeCommande('livraisonSeule')}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  typeCommande === 'livraisonSeule' && styles.typeBtnTextActive,
                ]}
              >
                Livraison seule
              </Text>
            </TouchableOpacity>
          </View>

          {(typeCommande === 'achatLivraison' || typeCommande === 'livraisonSeule') && (
            <>
              <Text style={styles.label}>Adresse de départ</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalDepartVisible(true)}
              >
                <Text style={{ fontSize: 16, color: depart ? '#000' : '#aaa' }}>
                  {depart || "Sélectionnez une adresse de départ"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Adresse d’arrivée</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalArriveeVisible(true)}
              >
                <Text style={{ fontSize: 16, color: arrivee ? '#000' : '#aaa' }}>
                  {arrivee || "Sélectionnez une adresse d’arrivée"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Produits et contact</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="- Votre numéro, vos produits pour achat (expliquez clairement et détaillez)"
                value={produits}
                onChangeText={setProduits}
              />

              {typeCommande === 'achatLivraison' && (
                <>
                  <Text style={styles.label}>Montant total des achats (FCFA)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex : 10000"
                    keyboardType="numeric"
                    value={montantColis}
                    onChangeText={setMontantColis}
                  />
                </>
              )}

              {frais !== null && montantTotal !== null && (
                <>
                  <Text style={styles.result}>Frais estimés : {frais} FCFA</Text>
                  <Text style={styles.result}>Montant total à payer : {montantTotal} FCFA</Text>
                </>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Valider et payer</Text>
              </TouchableOpacity>
            </>
          )}

          <Modal
            visible={modalDepartVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionnez une adresse de départ</Text>
                <FlatList
                  data={adresses}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) =>
                    renderAdresseItem(item, (selected) => {
                      setDepart(selected);
                      setModalDepartVisible(false);
                    })
                  }
                />
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setModalDepartVisible(false)}
                >
                  <Text style={{ color: '#ff6600', fontWeight: 'bold' }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={modalArriveeVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionnez une adresse d’arrivée</Text>
                <FlatList
                  data={adresses}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) =>
                    renderAdresseItem(item, (selected) => {
                      setArrivee(selected);
                      setModalArriveeVisible(false);
                    })
                  }
                />
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setModalArriveeVisible(false)}
                >
                  <Text style={{ color: '#ff6600', fontWeight: 'bold' }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: 'rgba(255,255,255,0.9)',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  typeButtons: {
    gap:5,
    right:10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: '#ff6600',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: -1,
  },
  typeBtnActive: {
    backgroundColor: '#ff6600',
  },
  typeBtnText: {
    color: '#ff6600',
    fontWeight: 'bold',
    fontSize: 16,
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  result: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 15,
    textAlign: 'center',
  },
  adresseItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
});
