import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const restaurants = [
  {
    id: '1',
    name: 'Le Campement',
    menu: 'Spécialités fruits de mer, poissons braisés, cocktails locaux.',
  },
  {
    id: '2',
    name: 'Chez Mélanie',
    menu: 'Cuisine ivoirienne, attiéké-poisson, poulet braisé.',
  },
  {
    id: '3',
    name: 'Pizza Time',
    menu: 'Pizzas artisanales, burgers, jus de fruits frais.',
  },
  {
    id: '4',
    name: 'Le Goût du Soleil',
    menu: 'Plats méditerranéens, grillades, plats végétariens.',
  }
];

const RestaurantsAssinieScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/pizza.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Image
            source={require('../assets/swamin_logo.png')}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Restaurants d'Assinie Mafia</Text>
        </View>

        <FlatList
          data={restaurants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Campement', { restaurant: item })}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.menu}>{item.menu}</Text>
              <Text style={styles.link}>→ Voir détails</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'orange',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: 'orange',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  menu: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  link: {
    marginTop: 8,
    color: 'orange',
    fontStyle: 'italic',
  },
});

export default RestaurantsAssinieScreen;
