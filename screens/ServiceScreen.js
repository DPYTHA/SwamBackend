import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ServiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Pharmacie')}
      >
        <Text style={styles.buttonText}>Pharmacie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Restaurant')}
      >
        <Text style={styles.buttonText}>Restaurant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SuperMarche')}
      >
        <Text style={styles.buttonText}>SuperMarché</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 15,
    width: '80%',
    alignItems: 'center',
    elevation: 3, // ombre Android
    shadowColor: '#000', // ombre iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
});
