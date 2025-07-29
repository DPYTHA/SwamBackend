import React from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView } from 'react-native';

const DATA = [
  {
    title: 'Pango 1',
    data: [
      'Mosquée',
      'Église Assemblée de Dieu',
      'Résidence egnehué',
    ],
  },
  {
    title: 'Pango 2',
    data: [
      'Pharmacie',
      'Atelier espoir',
      'Chez Mr Akalo',
    ],
  },
  {
    title: 'Epkouzan',
    data: [
      'Assinie Lodge',
      'Campement',
      'Milan hôtel sominou',
    ],
  },
  {
    title: 'Donwahi',
    data: [
      'Epp KPMG',
      'Essouman hôtel',
      'Yamaman lodge',
    ],
  },
  {
    title: 'Voie principale',
    data: [
      'Sodeci',
      'Cour royale',
      'Quai du beach',
      'Pont',
      'Mairie',
      'Super marché',
    ],
  },
  {
    title: 'Zion',
    data: [
      'Assinie beach club',
      'Agence Moov',
      'Maison ancien chef',
      'Palais bar',
      'Zion hôtel',
    ],
  },
  {
    title: 'Voie du marché',
    data: [
      'Au bord chez miss olga',
      'EPP Assinie 1A et 1B',
      'Boulangerie',
    ],
  },
  {
    title: 'Voie du commissariat',
    data: [
      'Commissariat',
      'Cité des enseignants',
      'Hôtel cool Mafia',
    ],
  },
  {
    title: 'Voie du dispensaire',
    data: [
      'Dispensaire',
      'Hôtel Sandrofia',
      'Église méthodiste',
    ],
  },
  {
    title: 'Voie catholique',
    data: [
      'Église catholique',
      'Maternité',
    ],
  },
  {
    title: 'Sagbadou',
    data: [
      'Boutique de Sagbadou',
      'Cimetière',
      'Tarpon',
    ],
  },
  {
    title: 'Autres',
    data: [
      'Alikro',
      'Abissa lodge',
      'Station',
      'N\'goakro',
      'Carrefour Essankro',
      'Biko lodge',
      'Résidence djéne',
      'Le sunshine lodge',
      'Mykonos',
      'L\'escapade hôtel',
      'Akoula kan lodge',
      'Nahiko hôtel',
      'Akwa beach',
      'Coucoué lodge',
      'Marine de Babihana',
      'Le Climbié d\'Assinie',
      'Villa Touraco',
      'La maison d\'Akoula',
      'Villa Akwaba',
      'Elimah Houses',
      'Hôtel André Richard',
      'Féline Lodge',
      'Hôtel le Premier Assouindé',
      'Notevia Hôtel',
      'Assinie Beach Hôtel',
      'Rond-point d\'Assouindé',
    ],
  },
];

const AdressesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📍 Adresses à Assinie Mafia</Text>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default AdressesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f7faff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
    color: '#003366',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#d9e8f5',
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
});
