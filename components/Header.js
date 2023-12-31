import { StyleSheet, Image, Text, View, FlatList, StatusBar, Platform, Pressable, ScrollView, ToastAndroid } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import axios from 'axios';
import { baseUrl } from '../screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currentUserAtom, songStateAtom } from '../store';
import { useAtom } from 'jotai';
import { MD3Colors } from 'react-native-paper'

export default function Header() {
    const navigation = useNavigation()
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
    const [songState, setSongState] = useAtom(songStateAtom)

    const handleAuthentication = async () => {
        setSongState((prev) => ({
            ...prev,
            isPlaying: false
        }))
        navigation.navigate('Login')
    }
    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwt')
        setCurrentUser(null)
        // setSongState((prev) => ({
        //     ...prev,
        //     isPlaying: false
        // }))
        // navigation.navigate('Login')
    }


    return currentUser ? <View style={{
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
    }
    >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    resizeMode: "cover",
                }}
                source={{ uri: currentUser.avatar }}
            />
            <Text
                style={{
                    marginLeft: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                }}
            >
                {currentUser.userName}
            </Text>
        </View>
        <Pressable onPress={() => handleLogout()}>
            <MaterialCommunityIcons name="logout" size={24} color="white" />
        </Pressable>

    </View > : <View style={{ justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 10 }}>
        <Pressable onPress={() => handleAuthentication()} style={({ pressed }) => pressed ? styles.buttonPressed : styles.button}>
            <Text style={styles.buttonText}>Login / Register</Text>
        </Pressable>
    </View>


}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
    button: {
        backgroundColor: "#131624",
        paddingVertical: 10,
        width: 150,
        borderRadius: 10,
        fontWeight: '900',
        alignItems: 'center',
        borderColor: "#C0C0C0",
        borderWidth: 0.8,
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    buttonPressed: {
        backgroundColor: MD3Colors.error50,
        paddingVertical: 10,
        width: 150,
        borderRadius: 10,
        fontWeight: '900',
        alignItems: 'center',
        borderColor: "#C0C0C0",
        borderWidth: 0.8,
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    buttonText: {
        fontWeight: "500",
        color: 'white',
        textAlign: 'center'
    }
})