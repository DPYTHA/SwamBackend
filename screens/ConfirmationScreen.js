import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ConfirmationScreen({ navigation, route }) {
  const { codeSuivi } = route.params || {};

  useEffect(() => {
    if (codeSuivi) {
      // Stocker dans le local storage si besoin
      // Par exemple : AsyncStorage.setItem("code_suivi", codeSuivi);
    }
  }, [codeSuivi]);

  const handleRetourAccueil = () => {
    navigation.navigate('Dashboard', { code: codeSuivi });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/swamin_logo.png')} // Assure-toi que ce fichier existe dans /assets
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Commande confirmée ✅</Text>

      <Icon name="check-circle" size={70} color="green" style={styles.icon} />

      <Text style={styles.message}>
        Merci pour votre confiance !{'\n'}
        Votre commande a été enregistrée avec succès.{'\n\n'}
        Nous vous contacterons très bientôt pour la livraison.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRetourAccueil}>
        <Text style={styles.buttonText}>Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 <Text style={{ color: 'orange' }}>Pythacademy</Text></Text>
        <Text style={styles.footerText}>Swam – Ensemble, on va plus loin 🚚</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 20
  },
  title: {
    color: 'orangered',
    fontSize: 22,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icon: {
    marginVertical: 20
  },
  message: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20
  },
  button: {
    backgroundColor: 'orangered',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  footer: {
    marginTop: 40,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center'
  }
});
