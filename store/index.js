import { atom, useAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currentUser = atom(null)

const userAtom = atom(async (get) => {
    try {
        // Load user information from AsyncStorage or an API call
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
            return JSON.parse(userData);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
});

export function useUser() {
    return useAtom(userAtom);
}

export async function setUser(user) {
    try {
        // Save the user information to AsyncStorage
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        userAtom.onMount();
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

export async function clearUser() {
    try {
        // Clear user information from AsyncStorage
        await AsyncStorage.removeItem('user_data');
        userAtom.onMount();
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
}
