import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = 60; // Largeur bouton slider

const HomeScreen = () => {
  const navigation = useNavigation();
  const pan = useRef(new Animated.ValueXY()).current;
  const maxX = width * 0.9 - BUTTON_WIDTH; // Largeur container - bouton

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > maxX) newX = maxX;
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > maxX * 0.95) {
          // Si glissé presque au bout (95%), naviguer vers Register
          navigation.navigate('Register');
          pan.setValue({ x: 0, y: 0 }); // Reset position après navigation
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Image locale depuis VSCode */}
        <Image source={require('../assets/swamin_logo.png')} style={styles.logo} />
        <Text style={styles.brand}>Swam</Text>
        <View style={styles.links}>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Inscription</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Connexion</Text>
          </Pressable>
        </View>
      </View>

      {/* Images locales dans slider */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        {[require('../assets/pass1.png'), require('../assets/pass2.png'), require('../assets/pass5.png'), require('../assets/pass4.png')].map((img, index) => (
          <Image
            key={index}
            source={img}
            style={styles.slideImage}
          />
        ))}
      </ScrollView>

      {/* Image locale principale */}
      <Image
        source={require('../assets/BackLogo.png')}
        style={styles.mainImage}
      />

      <View style={styles.tags}>
        <Pressable style={styles.tag}  onPress={() => navigation.navigate('Adresse')}><Text>Sagbadou</Text></Pressable>
        <Pressable style={styles.tag}  onPress={() => navigation.navigate('PromoCode')}><Text>Code Bonus</Text></Pressable>
        <Pressable style={styles.tag} onPress={() => navigation.navigate('Track')}>
          <Text>Ma commande</Text>
        </Pressable>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderText}>Glisser pour commencer</Text>
        <Animated.View
          style={[styles.sliderButton, { transform: [{ translateX: pan.x }] }]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.sliderArrow}>➤</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 <Text style={{ color: 'orange' }}>Pythacademy</Text> – Tous droits réservés</Text>
        <Text style={styles.footerText}>Conçu avec ❤️ pour les communautés locales</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  logo: {
    width: 60,
    height: 60, // Corrigé ici, height ne doit pas être 0
    resizeMode: 'contain',
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  links: {
    flexDirection: 'row',
    gap: 10,
  },
  link: {
    color: '#111',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  slider: {
    marginVertical: 10,
    height: 140,
  },
  slideImage: {
    width: 200,
    height: 130,
    borderRadius: 10,
    marginHorizontal: 5,
    resizeMode: 'cover',
  },
  mainImage: {
    width: width * 0.9,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 20,
    marginVertical: 20,
  },
  tags: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'orange',
  },
  sliderContainer: {
    width: width * 0.9,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 50,
    marginTop: 30,
    justifyContent: 'center',
    overflow: 'hidden', // important pour cacher la flèche hors container
  },
  sliderText: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#999',
    fontWeight: 'bold',
    zIndex: 0,
  },
  sliderButton: {
    width: BUTTON_WIDTH,
    height: 60,
    backgroundColor: 'orangered',
    borderRadius: 30,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sliderArrow: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
});

export default HomeScreen;
