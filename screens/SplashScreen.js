import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slogan animation delay
    setTimeout(() => {
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 3000);

    // Redirect after delay
    setTimeout(() => {
      navigation.replace('Home'); // Assure-toi que "Home" est défini dans ton Navigator
    }, 7000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/swamin_logo.png')} 
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.slogan, { opacity: sloganOpacity }]}>
        Swam, m'a bougé m'ba
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  slogan: {
    marginTop: 20,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333',
  },
});
