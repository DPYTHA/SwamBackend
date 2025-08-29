import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Linking } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    phone: '',
    location: 'Assinie-Mafia',
    avatarUrl: 'https://i.pravatar.cc/100',
  });
const appelerLivreur = () => {
  const numero = '+2250101769518'; 
  Linking.openURL(`tel:${numero}`);
};

  const [commande, setCommande] = useState([]);
  const [trackingCode, setTrackingCode] = useState('');
  


  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const nom = await SecureStore.getItemAsync('nom');
        const prenom = await SecureStore.getItemAsync('prenom');
        const phone = await SecureStore.getItemAsync('phone');
        const avatarUrl = await SecureStore.getItemAsync('avatarUrl');

        setUserInfo({
          nom: nom || '',
          prenom: prenom || '',
          phone: phone || '',
          location: 'Assinie-Mafia',
          avatarUrl: avatarUrl || 'https://i.pravatar.cc/100',
        });
      } catch (error) {
        console.error('Erreur lors du chargement des infos utilisateur', error);
      }
    };

    loadUserInfo();
  }, []);





  
  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
      console.log('TOKEN:', token); 

      if (!token) {
        console.error('Token manquant, impossible de faire la requête');
        return;
      }
        const response = await fetch('https://web-production-9c72c.up.railway.app/commandes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
       console.log('Status:', response.status);
        const data = await response.json();
       console.log('Data:', data);
        if (response.ok) {
          setCommande(data.commandes);
          if (data.user) setUserInfo(data.user);
        } else {
          console.error('Erreur lors de la récupération de l’historique');
        }
      } catch (error) {
        console.error('Erreur fetchHistorique:', error);
      }
    };

    fetchHistorique();
  }, []);

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission caméra refusée !');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setUserInfo(prev => ({ ...prev, avatarUrl: uri }));
      await SecureStore.setItemAsync('avatarUrl', uri);
    }
  };
  const chercherCommandeParCode = async () => {
  if (!trackingCode.trim()) {
    Alert.alert('Veuillez entrer un code de suivi.');
    return;
  }

  try {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) {
      Alert.alert('Erreur', 'Token manquant');
      return;
    }

    const response = await fetch(`https://web-production-9c72c.up.railway.app/commande/by-tracking-code/${trackingCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.commande) {
      navigation.navigate('SuiviCommande', { commande: data.commande });
    } else {
      Alert.alert('Commande non trouvée', 'Veuillez vérifier le code.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche du code:', error);
    Alert.alert('Erreur', 'Impossible de rechercher la commande');
  }
};

  /*deconnexion vers login en supprimant le token*/
 const handleLogout = async () => {
  await SecureStore.deleteItemAsync('access_token');
  navigation.navigate('Home'); 
};

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={pickImageFromCamera}>
            <Image source={{ uri: userInfo.avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <Text style={styles.helloText}>
              Salut, {userInfo.prenom} {userInfo.nom}
            </Text>
            <Text style={styles.location}>{userInfo.location}</Text>
          </View>
        </View>
       <View style={styles.icons}>
  <TouchableOpacity onPress={() => { navigation.navigate('Chat')}}>
    <Ionicons name="chatbubble-outline" size={24} color="black" style={styles.icon} />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => { 
   
    handleLogout(); 
  }}>
    <Ionicons name="log-out-outline" size={24} color="black" />
  </TouchableOpacity>
</View>

      </View>

      {/* chercher une commande  */}
      <Text style={styles.title}>Localiser votre commande ici</Text>
      <Text style={styles.subtitle}>facile ! pour éviter les longues attentes</Text>
     <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="code de suivi ici"
    value={trackingCode}
    onChangeText={setTrackingCode}
  />
  <TouchableOpacity style={styles.searchButton} onPress={chercherCommandeParCode}>
    <Ionicons name="search" size={20} color="#fff" />
  </TouchableOpacity>
</View>


      {/* BOUTONS ACTIONS */}
      <View style={styles.containerBox}>
        <TouchableOpacity
          style={styles.longBox}
          onPress={() => navigation.navigate('Commande')}
        >
          <Text style={styles.longBoxText}>Faire une commande</Text>
        </TouchableOpacity>
<TouchableOpacity
  style={styles.shortBox}
  onPress={() => navigation.navigate('Services')}
>
  <Text style={styles.shortBoxText}>Quelques services</Text>
  <Text style={styles.shortBoxSubText}>
    restaurants, pharmacies, supermarchés
  </Text>
</TouchableOpacity>

      </View>

      {/* HISTORIQUE DES COMMANDES */}
      <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
        {commande.length === 0 ? (
          <Text style={{ textAlign: 'center', color: 'gray' }}>Aucune commande trouvée.</Text>
        ) : (
          commande.map((item, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: userInfo.avatarUrl || 'https://via.placeholder.com/40' }}
                  style={styles.avatarSmall}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {userInfo.nom} <Entypo name="check" size={14} color="green" />
                  </Text>
                  <Text style={styles.code}>Commande #{item.id}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.deliveryStatus}>
                    {item.statut === 0
                      ? 'En attente'
                      : item.statut === 1
                      ? 'En cours'
                      : 'Livrée'}
                  </Text>
                  <Text style={styles.rating}>💰 {item.montant_total} FCFA</Text>
                </View>
              </View>

              <Text style={styles.trackingCode}>
                Tracking code:{' '}
                <Text style={{ fontWeight: 'bold' }}>{item.tracking_code}</Text>
              </Text>

              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="dodgerblue" />
                <Text style={styles.locationText}>{item.depart}</Text>
              </View>

              <View style={styles.locationRow}>
                <Entypo name="location-pin" size={16} color="green" />
                <Text style={styles.locationText}>{item.arrivee}</Text>
              </View>

              <Text style={{ paddingHorizontal: 10, marginTop: 5, color: '#555' }}>
                📦 Produit(s) : {item.produits}
              </Text>

              <Text
                style={{
                  paddingHorizontal: 10,
                  marginTop: 2,
                  fontStyle: 'italic',
                  fontSize: 12,
                }}
              >
                🕒 Date commande :{' '}
                {new Date(item.date_commande).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cardButton} onPress={appelerLivreur}>
                 <Text style={styles.cardButtonText}>Contacter le livreur</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[styles.cardButton, { backgroundColor: '#f5f5f5' }]}
                              onPress={() => navigation.navigate('Chat')}
                                                                             >
                   <Text style={[styles.cardButtonText, { color: 'black' }]}>Chat livreur</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
       
        
         <TouchableOpacity onPress={() => { 
   
    handleLogout(); 
  }}>
     <Ionicons name="home" size={24} color="orangered" />
  </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Chat')}}>
       <Ionicons name="cube-outline" size={24} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Chat')}}>
        <Ionicons name="paper-plane" size={28} color="white" style={styles.middleIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('PromoCode')}}>
    <Ionicons name="wallet-outline" size={24} color="#444" />
  </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Edit')}}>
     <Ionicons name="person-outline" size={24} color="#444" />
  </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10
  },
  avatarSmall: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10
  },
  helloText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  location: {
    fontSize: 12,
    color: 'gray'
  },
  icons: {
    flexDirection: 'row'
  },
  AllOrders:{
padding:7,
 flexDirection: 'row',
 left:-19,
alignItems: 'center',
gap:5
  },
  icon: {
    marginRight: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30
  },
  subtitle: {
    color: 'gray',
    marginBottom: 15
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    paddingLeft: 16
  },
  searchButton: {
    backgroundColor: 'orangered',
    padding: 12,
    borderRadius: 12,
    marginLeft: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 30,
    marginTop: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14
  },
  code: {
    fontSize: 12,
    color: '#555'
  },
  deliveryStatus: {
    color: 'deepskyblue',
    fontSize: 12
  },
  rating: {
    fontSize: 14,
    marginRight: 4
  },
  trackingCode: {
    fontSize: 12,
    marginBottom: 10
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  locationText: {
    marginLeft: 6,
    fontSize: 13
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  cardButton: {
    flex: 0.48,
    backgroundColor: 'orangered',
    padding: 10,
    borderRadius: 10
  },
  cardButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600'
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  middleIcon: {
    backgroundColor: 'orangered',
    padding: 12,
    borderRadius: 30,
    marginTop: -20
  },


  containerBox: {
    padding: 20,
    alignItems: 'center',
  },
  longBox: {
    backgroundColor: '#e7e3e3ce',
    height: 60,
    width: '70%',
    borderRadius: 10,
    borderColor: 'orange',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  longBoxText: {
    color: '#dc7429ce',
    fontSize: 18,
    fontWeight: '600',
  },
  shortBox: {
    backgroundColor: '#dc7429ce',
    height: 60,
    width: '60%',
    borderRadius: 10,
    borderColor: 'orange',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortBoxText: {
    color: '#dc7429ce',
    fontSize: 16,
    fontWeight: '500',
  },
  shortBoxText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'white',
},
shortBoxSubText: {
  fontSize: 10,
  fontStyle: 'italic',
  color: '#0f0b0bff',
  marginTop: 2,
  textAlign:'center'
},



});
