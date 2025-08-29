// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import DashboardScreen from './DashboardScreen';
import CommandeScreen from './CommandeScreen';
import LivreurScreen from './LivreurScreen';
import PaiementScreen from './PaiementScreen';
import ConfirmationScreen from './ConfirmationScreen';
import ServiceScreen from './ServiceScreen';
import MedicamentsScreen from './MedicamentsScreen';
import MarcheScreen from './MarcheScreen';
import ChatScreen from './ChatScreen';
import AdminScreen from './AdminScreen';
import AdminChatScreen from './AdminChatScreen';
import SuiviCommandeScreen from './SuiviCommandeScreen';
import EditProfileScreen from './EditProfileScreen';
import PromoCodesScreen from './PromoCodesScreen';
import TrackingScreen from './TrackingScreen';
import AdressesScreen from './AdressesScreen';
import LivreurSuiviScreen from './LivreurSuiviScreen';
import RestaurantsAssinieScreen from './RestaurantsAssinieScreen';
import MenuCampementScreen from './MenuCampementScreen';
import PanierScreen from './PanierScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen}/>
         <Stack.Screen name="Dashboard" component={DashboardScreen}/>
        <Stack.Screen name="Commande" component={CommandeScreen}/>
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Paiement" component={PaiementScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name='Services' component={ServiceScreen}/>
        <Stack.Screen name='Pharmacie' component={MedicamentsScreen}/>
         <Stack.Screen name='SuperMarche' component={MarcheScreen}/>
         <Stack.Screen name='Livreur' component={LivreurScreen}/>
         <Stack.Screen name='Admin' component={AdminScreen}/>
         <Stack.Screen name='AdminChat' component={AdminChatScreen}/>
          <Stack.Screen name='SuiviCommande' component={SuiviCommandeScreen}/>
          <Stack.Screen name='Edit' component={EditProfileScreen}/>
          <Stack.Screen name='PromoCode' component={PromoCodesScreen}/>
          <Stack.Screen name='Track' component={TrackingScreen}/>
          <Stack.Screen name='Adresse' component={AdressesScreen}/>
           <Stack.Screen name='LivreurSuivi' component={LivreurSuiviScreen}/>
           <Stack.Screen name='Restaurant' component={RestaurantsAssinieScreen}/>
           <Stack.Screen name='Campement' component={MenuCampementScreen}/>
           <Stack.Screen name='Panier' component={PanierScreen}/>




         

        



      </Stack.Navigator>
    </NavigationContainer>
  );
}
