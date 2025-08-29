import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Remplace par ton URL backend
const API_URL = 'https://web-production-9c72c.up.railway.app/';

const AdminChatScreen = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [adminId, setAdminId] = useState('3'); // ID admin (à ajuster ou récupérer dynamiquement)
  const unreadMessagesRef = useRef({}); // stocke les ids clients avec messages non lus

  // Charger clients — ici on récupère les users qui sont clients (pas admin ni livreur)
  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);  // Attention: il faut créer cette route dans Flask
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setClients(data.users.filter(u => u.role === 'client'));
      }
    } catch (err) {
      console.error('Erreur fetch clients:', err);
    }
  };

  // Charger messages avec le client sélectionné
  const fetchMessages = async (clientId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages?sender_id=${adminId}&receiver_id=${clientId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)));
        // Marquer comme lu (enlever notif)
        unreadMessagesRef.current[clientId] = false;
        setClients((prev) => [...prev]); // Forcer re-render liste
      }
    } catch (err) {
      console.error('Erreur fetch messages:', err);
    }
  };

  // Envoi message
  const sendMessage = async () => {
    if (!message.trim() || !selectedClient) return;
    try {
      const res = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: adminId,
          receiver_id: selectedClient.id,
          content: message,
        }),
      });
      if (res.ok) {
        setMessage('');
        fetchMessages(selectedClient.id);
      } else {
        Alert.alert('Erreur', 'Échec de l’envoi');
      }
    } catch (err) {
      console.error('Erreur envoi message:', err);
    }
  };

  // Vérifier les nouveaux messages toutes les 5 sec
  useEffect(() => {
    fetchClients();

    const interval = setInterval(async () => {
      // Pour chaque client, vérifier s'il y a des messages non lus
      for (const client of clients) {
        try {
          const res = await fetch(`${API_URL}/api/chat/messages?sender_id=${client.id}&receiver_id=${adminId}`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // S'il y a un message plus récent que celui qu'on a, on affiche la notif
            if (!messages.length || data[data.length -1].id !== messages[messages.length -1]?.id) {
              unreadMessagesRef.current[client.id] = true;
              setClients((prev) => [...prev]); // refresh liste pour badge
            }
          }
        } catch {}
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [clients, messages]);

  // Lorsqu’on sélectionne un client
  const onSelectClient = (client) => {
    setSelectedClient(client);
    fetchMessages(client.id);
    unreadMessagesRef.current[client.id] = false; // Reset notif
  };

  return (
    <View style={{flex: 1, flexDirection: 'row',paddingVertical:50}}>
      {/* Liste clients */}
      <View style={styles.clientList}>
        <Text style={styles.title}>Clients</Text>
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.clientItem,
                selectedClient?.id === item.id && styles.selectedClient,
              ]}
              onPress={() => onSelectClient(item)}
            >
              <Text>{item.username}</Text>
              {unreadMessagesRef.current[item.id] && (
                <View style={styles.unreadBadge} />
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Chat */}
      <View style={styles.chatContainer}>
        {selectedClient ? (
          <>
            <Text style={styles.title}>Discussion avec {selectedClient.username}</Text>
            <FlatList
              style={styles.messagesList}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.message,
                    item.sender_id.toString() === adminId ? styles.adminMessage : styles.clientMessage,
                  ]}
                >
                  <Text>{item.content}</Text>
                </View>
              )}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={80}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Écris ton message..."
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                  <Text style={styles.sendBtnText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </>
        ) : (
          <Text style={{textAlign: 'center', marginTop: 20}}>Sélectionne un client pour discuter</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clientList: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
   
  },
  clientItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  selectedClient: {
    backgroundColor: '#eee',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
  },
  chatContainer: {
    flex: 3,
    padding: 50,
  },
  messagesList: {
    height: '80%',
  },
  message: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '85%',
  },
  adminMessage: {
    backgroundColor: '#FF6B00',
    alignSelf: 'flex-end',
    color: 'white',
  },
  clientMessage: {
    backgroundColor: '#ddd',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    left:20
  },
  input: {
    
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 25,
    marginLeft: 10,
  },
  sendBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminChatScreen;
