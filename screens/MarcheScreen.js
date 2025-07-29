import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const produits = [
  { id: '1', designation: 'SAVON', prix: 500 },
  { id: '2', designation: 'SUCRE', prix: 750 },
  { id: '3', designation: 'RIZ 25KG', prix: 12000 },
  { id: '4', designation: 'RIZ 5KG', prix: 3000 },
  { id: '5', designation: 'RIZ 1KG', prix: 800 },
  { id: '6', designation: 'LAIT EN POUDRE', prix: 2000 },
  { id: '7', designation: 'HUILE 1L', prix: 1500 },
  { id: '8', designation: 'HUILE 5L', prix: 8000 },
  { id: '9', designation: 'SPAGHETTI', prix: 500 },
  { id: '10', designation: 'FARINE', prix: 900 },
  { id: '11', designation: 'PAIN', prix: 300 },
  { id: '12', designation: 'BOITE DE CONSERVE', prix: 1000 },
  { id: '13', designation: 'PATES ALIMENTAIRES', prix: 700 },
  { id: '14', designation: 'DETERGENT', prix: 1300 },
  { id: '15', designation: 'JUS EN PACK', prix: 2500 },
  { id: '16', designation: 'EVIAN 1.5L', prix: 1000 },
  { id: '17', designation: 'GAUFRES / BISCUITS', prix: 600 },
  { id: '18', designation: 'CHOCOLAT', prix: 900 },
  { id: '19', designation: 'BOISSON EN CANETTE', prix: 500 },
  { id: '20', designation: 'BONBONS', prix: 400 },
  { id: '21', designation: 'FEUILLE DE MENTHE', prix: 100 },
  { id: '22', designation: 'FEUILLE DE MENTHE (GRANDE)', prix: 200 },
  { id: '23', designation: 'GRAINE DE COURGE', prix: 200 },
  { id: '24', designation: 'GRAINE DE COURGE (GRANDE)', prix: 400 },
  { id: '25', designation: 'GRAINE DE SOUCHE', prix: 200 },
  { id: '26', designation: 'GRAINE DE SOUCHE (GRANDE)', prix: 400 },
  { id: '27', designation: 'GRAINE DE SÉSAME', prix: 200 },
  { id: '28', designation: 'GRAINE DE SÉSAME (GRANDE)', prix: 400 },
  { id: '29', designation: 'HARICOT', prix: 400 },
  { id: '30', designation: 'HARICOT (GRANDE)', prix: 800 },
  { id: '31', designation: 'HARICOT NOIR', prix: 400 },
  { id: '32', designation: 'HARICOT NOIR (GRANDE)', prix: 800 },
  { id: '33', designation: 'NÈGRE (HARICOT ROUGE)', prix: 400 },
  { id: '34', designation: 'NÈGRE (HARICOT ROUGE) GRANDE', prix: 800 },
  { id: '35', designation: 'MOUTARDE GRAINE', prix: 200 },
  { id: '36', designation: 'MOUTARDE GRAINE (GRANDE)', prix: 400 },
  { id: '37', designation: 'MOUTARDE POUDRE', prix: 200 },
  { id: '38', designation: 'MOUTARDE POUDRE (GRANDE)', prix: 400 },
  { id: '39', designation: 'MOUTARDE JAUNE', prix: 200 },
  { id: '40', designation: 'MOUTARDE JAUNE (GRANDE)', prix: 400 },
  { id: '41', designation: 'POISSON SEC', prix: 500 },
  { id: '42', designation: 'POISSON SEC (GRANDE)', prix: 1000 },
  { id: '43', designation: 'POISSON FUMÉ', prix: 500 },
  { id: '44', designation: 'POISSON FUMÉ (GRANDE)', prix: 1000 },
  { id: '45', designation: 'POISSON SALÉ', prix: 500 },
  { id: '46', designation: 'POISSON SALÉ (GRANDE)', prix: 1000 },
  { id: '47', designation: 'RIZ LOCAL', prix: 500 },
  { id: '48', designation: 'RIZ LOCAL (GRANDE)', prix: 1000 },
  { id: '49', designation: 'RIZ PARFUMÉ', prix: 600 },
  { id: '50', designation: 'RIZ PARFUMÉ (GRANDE)', prix: 1200 },
];


const ProductListScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.designation}>{item.designation}</Text>
        <Text style={styles.prix}>{item.prix} FCFA</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des Produits</Text>
      <FlatList
        data={produits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const ORANGE = '#FF6B00';
const NOIR = '#000000';
const BLANC = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLANC,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
  },
  designation: {
    fontSize: 18,
    color: NOIR,
    fontWeight: '600',
  },
  prix: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  button: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: BLANC,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;
