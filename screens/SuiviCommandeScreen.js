import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { Ionicons, Entypo, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function SuiviCommande({ route, navigation }) {
  const { commande } = route.params;

  const statutText = ['Enregistrée', 'En cours', 'Livrée'];
  const statutIcons = [
    <Ionicons name="checkmark-circle" size={30} color="#aaa" />,
    <MaterialIcons name="local-shipping" size={30} color="#aaa" />,
    <Ionicons name="checkmark-done-circle" size={30} color="#aaa" />,
  ];

  const statutActif = commande.statut;

  const callLivreur = () => {
    const numero = '+2250101769518';
    Linking.openURL(`tel:${numero}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Suivi de votre commande</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Code de suivi :</Text>
        <Text style={styles.value}>{commande.tracking_code}</Text>

        <Text style={styles.label}>Client :</Text>
        <Text style={styles.value}>{commande.nom_client} - {commande.telephone}</Text>

        <Text style={styles.label}>Produit(s) :</Text>
        <Text style={styles.value}>{commande.produits}</Text>

        <Text style={styles.label}>Départ :</Text>
        <Text style={styles.value}>{commande.depart}</Text>

        <Text style={styles.label}>Destination :</Text>
        <Text style={styles.value}>{commande.arrivee}</Text>

        <Text style={styles.label}>Montant :</Text>
        <Text style={styles.value}>{commande.montant_total} FCFA</Text>

        <Text style={styles.label}>Date :</Text>
        <Text style={styles.value}>
          {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
        </Text>
      </View>

      <Text style={styles.statusTitle}>Statut de la livraison :</Text>

      <View style={styles.timeline}>
        {statutIcons.map((icon, index) => (
          <View key={index} style={styles.step}>
            {React.cloneElement(icon, {
              color: index <= statutActif ? 'orangered' : '#ccc'
            })}
            <Text style={[styles.stepLabel, { color: index <= statutActif ? 'orangered' : '#aaa' }]}>
              {statutText[index]}
            </Text>
            {index < statutIcons.length - 1 && (
              <View style={[styles.line, { backgroundColor: index < statutActif ? 'orangered' : '#ccc' }]} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.callBtn} onPress={callLivreur}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.callText}>Appeler le livreur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callBtn, { backgroundColor: '#eee' }]}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#000" />
          <Text style={[styles.callText, { color: '#000' }]}>Chat livreur</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: {
    color: '#555',
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    marginTop: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 10,
  },
  step: {
    alignItems: 'center',
    width: '30%',
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  line: {
    position: 'absolute',
    height: 2,
    top: 15,
    right: '-50%',
    width: '100%',
    zIndex: -1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  callBtn: {
    flexDirection: 'row',
    backgroundColor: 'orangered',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
  },
});
