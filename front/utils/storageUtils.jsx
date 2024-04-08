import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('Token stored successfully!');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token !== null) {
      console.log('Token retrieved successfully:', token);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    console.log('Token removed successfully!');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};