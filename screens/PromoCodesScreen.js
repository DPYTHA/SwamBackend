import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PromoCodesScreen = () => {
  const [promoCodes, setPromoCodes] = useState([]);

  const fetchPromoCodes = async () => {
    const token = await AsyncStorage.getItem('access_token');
    try {
      const res = await fetch('http://192.168.1.5:5000/promo-codes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPromoCodes(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les codes promo');
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const copyCode = (code) => {
    Clipboard.setString(code);
    Alert.alert('Code copié !', `Le code "${code}" a été copié dans le presse-papiers.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.code}>{item.code}</Text>
      <Text>{item.description}</Text>
      <Text style={{ color: item.expired ? 'red' : 'green' }}>
        {item.expired ? 'Expiré' : `Valide jusqu'au ${item.expiryDate || 'indéfini'}`}
      </Text>
      {!item.expired && (
        <TouchableOpacity style={styles.button} onPress={() => copyCode(item.code)}>
          <Text style={styles.buttonText}>Copier le code</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={promoCodes}
      keyExtractor={(item) => item.code}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun code promo disponible</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'orangered',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PromoCodesScreen;
