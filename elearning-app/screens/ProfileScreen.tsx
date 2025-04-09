import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the path based on your project structure

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen = ({ navigation }: { navigation: ProfileScreenNavigationProp }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Memoize handleAuthError to avoid re-creation on every render
  const handleAuthError = useCallback(async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Session Expired', 'Please login again');
    navigation.navigate('LoginScreen');
  }, [navigation]);

  // Fetch token when component mounts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
        } else {
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        console.error('Failed to load token:', error);
        navigation.navigate('LoginScreen');
      }
    };

    loadToken();
  }, [navigation]);

  // Fetch user data when token is available
  useEffect(() => {
    if (!token) return;

    interface UserData {
      name: string;
      email: string;
      mobile?: string;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>('http://172.20.28.97:5000/api/auth/user', {
          headers: { 'x-auth-token': token }
        });

        setUser({
          name: response.data.name,
          email: response.data.email,
          mobile: response.data.mobile || '',
          password: ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
        handleAuthError();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, handleAuthError]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out" size={24} color="#ff4444" />
      </TouchableOpacity>

      {/* Profile Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
      </View>

      {/* Edit Toggle Button */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setEditMode(!editMode)}
      >
        <Ionicons 
          name={editMode ? 'close' : 'create'} 
          size={20} 
          color={editMode ? '#ff4444' : '#1e90ff'} 
        />
        <Text style={[styles.editButtonText, { color: editMode ? '#ff4444' : '#1e90ff' }]}>
          {editMode ? 'Cancel' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10,
  },
  editButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;