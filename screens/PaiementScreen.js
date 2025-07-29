import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView,Ionicons } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const PaiementScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [montant, setMontant] = useState(null);
  const [selectedOp, setSelectedOp] = useState(null);
  const [trackingCode, setTrackingCode] = useState(null);

  useEffect(() => {
    const { montant, tracking } = route.params || {};
    if (montant) setMontant(montant);
    if (tracking) setTrackingCode(tracking);
  }, [route.params]);

  const operators = [
    { id: 'orange', label: 'Orange Money', number: '07 10 06 97 91', icon: 'mobile-alt' },
    { id: 'mtn', label: 'MTN Mobile Money', number: 'pas encore disponible', icon: 'mobile-alt' },
    { id: 'moov', label: 'Moov Money', number: 'pas encore disponible', icon: 'sim-card' },
    { id: 'Wave', label: 'Wave', number: '07 10 06 97 91', icon: 'sim-card' }
  ];

  const confirmerPaiement = () => {
    Alert.alert('✅ Paiement confirmé', `Merci ! Attendez notre confirmation`, [
      { text: 'OK', onPress: () => navigation.navigate('Confirmation') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paiement sécurisé</Text>

      

      <View style={styles.opList}>
        {operators.map(op => (
          <View key={op.id}>
            <TouchableOpacity
              style={[styles.operator, selectedOp === op.id && styles.selected]}
              onPress={() => setSelectedOp(op.id)}
            >
              <FontAwesome5 name={op.icon} size={22} color="orangered" style={styles.icon} />
              <Text style={styles.label}>{op.label}</Text>
            </TouchableOpacity>
            {selectedOp === op.id && <Text style={styles.number}>Envoyez à : {op.number}</Text>}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={confirmerPaiement}>
        <Text style={styles.buttonText}>J’ai payé</Text>
      </TouchableOpacity>


  
   

      <Text style={styles.footer}>© 2025 <Text style={{ color: 'orange' }}>Pythacademy</Text></Text>
      <Text style={styles.footer}>Merci pour votre confiance</Text>
    </ScrollView>
  );
};

export default PaiementScreen;

const styles = StyleSheet.create({
  container: {
   paddingVertical: 180,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: 'orangered',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  montant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 30,
    textAlign: 'center',
  },
  opList: {
    width: '80%',
    gap: 15,
    marginBottom: 30,
  },
  operator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
  },
  selected: {
    borderColor: 'orangered',
    backgroundColor: '#fff8f0',
  },
  icon: {
    width: 30,
    textAlign: 'center',
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  number: {
    marginLeft: 45,
    marginTop: 5,
    fontSize: 14,
    color: '#444',
  },
  button: {
    width: '60%',
    backgroundColor: 'orangered',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  },
});
