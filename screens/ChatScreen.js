import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // <-- Import Ionicons
 import * as SecureStore from 'expo-secure-store';
const ChatScreen = ({ navigation }) => {  // <-- navigation dans les props
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [prenom, setPrenom] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

 

useEffect(() => {
  const getUserData = async () => {
    
    const storedPrenom = await SecureStore.getItemAsync('prenom');
    const storedUserId = await SecureStore.getItemAsync('user_id');
    const storedReceiverId = await SecureStore.getItemAsync('adminId');
    if (storedPrenom) setPrenom(storedPrenom);
   
     if (storedUserId) setSenderId(parseInt(storedUserId));
    setReceiverId(storedReceiverId || '3');
    console.log('senderId:', storedUserId, 'receiverId:', storedReceiverId);
  };

  getUserData();
}, []);


  useEffect(() => {
    if (senderId && receiverId) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [senderId, receiverId]);

  const loadMessages = async () => {
  try {
    const res = await fetch(`https://web-production-9c72c.up.railway.app/api/chat/messages?sender_id=${senderId}&receiver_id=${receiverId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setMessages(data.reverse());
    }
  } catch (err) {
    console.error('Erreur chargement des messages :', err);
  }
};

const sendMessage = async () => {
  if (!message.trim() || !senderId || !receiverId)
    
    
     return;
  console.log('Envoi message:', message);
  console.log('Envoi message:', message, 'senderId:', senderId, 'receiverId:', receiverId);
  try {
    const response = await fetch('https://web-production-9c72c.up.railway.app/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        content: message,
      }),
    });
    if (response.ok) {
      setMessage('');
      loadMessages();
    } else {
      const errData = await response.json();
      console.error('Erreur envoi message:', errData);
    }
  } catch (err) {
    console.error('Erreur réseau :', err);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingVertical: 50,left:10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

     <FlatList
  data={messages}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    let messageStyle = styles.otherMessage; // style par défaut (gris)

    if (parseInt(item.sender_id) === parseInt(senderId)) {
      messageStyle = styles.myMessage; // message du client
    } else if (parseInt(item.sender_id) === 3) {
      messageStyle = styles.adminMessage; // message de l'admin
    }

    return (
      <View style={[styles.messageContainer, messageStyle]}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  }}
  contentContainerStyle={styles.messagesContainer}
/>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Écris ton message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
  onPress={sendMessage}
  activeOpacity={0.7}
  style={styles.sendBtn}
>
  <Text style={styles.sendBtnText}>Envoyer</Text>
</TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const ORANGE = '#FF6B00';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  messageList: {
    padding: 15,
    justifyContent: 'center',
    
  },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    backgroundColor: ORANGE,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: BLACK,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: BLACK,
  },
  sendBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
  },
 adminMessage: {
  backgroundColor: 'orange',
  alignSelf: 'flex-start',
  padding: 10,
  marginVertical: 4,
  borderRadius: 8,
  maxWidth: '80%',
},

  sendBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
