import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

const API_URL = "https://web-production-9c72c.up.railway.app"; // ✅ corrigé

const plats = [
  { id: '1', nom: 'Pizza Margherita', prix: 7000, composition: 'Sauce tomate, mozzarella, basilic frais' },
  { id: '2', nom: 'Kedjenou de poulet', prix: 10000, composition: 'Poulet, légumes, épices locales' },
  { id: '3', nom: 'T-Bone grillé', prix: 8000, composition: 'Viande de boeuf grillée, sauce au choix' },
  { id: '4', nom: 'Kedjenou de poulet pondeuses', prix: 10000, composition: 'Poulet, légumes, épices africaines' },
  { id: '5', nom: 'Kedjenou de pintade', prix: 15000, composition: 'Pintade mijotée aux épices locales' },
  { id: '6', nom: 'Soupe du pêcheur', prix: 10000, composition: 'Poisson, crustacés, bouillon épicé' },
  { id: '7', nom: 'Soupe de poisson', prix: 10000, composition: 'Poisson, tomates, piment, oignon' },
  { id: '8', nom: 'Pizza Margherita', prix: 7000, composition: 'Sauce tomate, mozzarella, basilic' },
  { id: '9', nom: 'Pizza Royale', prix: 7000, composition: 'Tomate, mozzarella, jambon, champignons' },
  { id: '10', nom: 'Pizza Bolognaise', prix: 7000, composition: 'Sauce bolognaise, fromage' },
  { id: '11', nom: 'Pizza Fermière', prix: 9000, composition: 'Fromage, poulet, légumes' },
  { id: '12', nom: 'Spaghettis carbonara', prix: 7000, composition: 'Spaghettis, lardons, crème, oeufs, parmesan' },
  { id: '13', nom: 'Spaghettis aux crevettes', prix: 10000, composition: 'Spaghettis, crevettes sautées, ail, persil' },
  { id: '14', nom: 'Tagliatelles aux fruits de mer', prix: 10000, composition: 'Tagliatelles, fruits de mer, sauce maison' },
  { id: '15', nom: 'Spaghettis aux poissons', prix: 7000, composition: 'Spaghettis, morceaux de poisson épicés' },
  { id: '16', nom: 'Coupe de glace parfumée au choix', prix: 1500, composition: 'Vanille, chocolat, fraise' },
  { id: '17', nom: 'Assiette de fruits', prix: 2000, composition: 'Fruits frais de saison coupés' },
  { id: '18', nom: 'Pizza aux Fruits de Mer', prix: 10000, composition: 'Tomate, crevettes, calamars, moules' },
  { id: '19', nom: 'Coca, Fanta, Sprite, Tonic', prix: 500, composition: 'Sodas classiques (33cl)' },
  { id: '20', nom: 'Fanta 60cl, Guinness', prix: 1000, composition: 'Fanta 60cl ou Guinness 50cl' }
];

export default function MenuCampement({ navigation }) {
  const [commande, setCommande] = useState([]);

  const ajouterPlat = async (plat) => {
    try {
      const response = await fetch(`${API_URL}/commandeRestau`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom_plat: plat.nom,
          prix: plat.prix,
          composition: plat.composition,
          quantite: 1
        })
      });

      const text = await response.text(); // ✅ lire en texte d'abord
      console.log("Réponse brute du serveur:", text);

      let data;
      try {
        data = JSON.parse(text); // ✅ tenter de parser en JSON
      } catch {
        throw new Error("Le serveur n'a pas renvoyé du JSON. Vérifie l'URL ou le backend.");
      }

      if (response.ok) {
        Alert.alert("Succès", "Plat ajouté à la commande !");
        setCommande([...commande, plat]);
      } else {
        Alert.alert("Erreur", data.error || "Impossible d'enregistrer la commande");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", error.message || "Problème de connexion au serveur");
    }
  };

  const allerAuPanier = () => {
    navigation.navigate('Panier', { panier: commande });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image source={require('../assets/Campement.png')} style={styles.bg} />
        <Text style={styles.titre}>Menu du Campement</Text>

        {plats.map((plat) => (
          <View key={plat.id} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 3 }}>
                <Text style={styles.nom}>{plat.nom}</Text>
                <Text style={styles.composition}>{plat.composition}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.prix}>{plat.prix} FCFA</Text>
                <TouchableOpacity style={styles.btnAjouter} onPress={() => ajouterPlat(plat)}>
                  <Text style={styles.btnText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {commande.length > 0 && (
        <TouchableOpacity style={styles.btnCommander} onPress={allerAuPanier}>
          <Text style={styles.btnText}>Voir la commande ({commande.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', padding: 10 },
  bg: { width: '100%', height: 150, resizeMode: 'cover', borderRadius: 10 },
  titre: { color: 'orange', fontSize: 24, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  nom: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  prix: { color: 'orange', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  composition: { fontSize: 14, color: '#555', marginTop: 5 },
  right: { flex: 1, alignItems: 'flex-end', justifyContent: 'space-between' },
  btnAjouter: { backgroundColor: 'orange', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginTop: 5 },
  btnCommander: { backgroundColor: 'black', padding: 15, alignItems: 'center', position: 'absolute', bottom: 10, left: 10, right: 10, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: 'bold' },
});
