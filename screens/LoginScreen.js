import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import * as React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons"
import { useImmer } from 'use-immer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../services/user.service'
import axios from 'axios'

export default function LoginScreen({ navigation }) {
    const [authenticationInfo, setAuthenticationInfo] = useImmer({ email: '', password: '' })
    const [currentUser, setcurrentUser] = useImmer(null)
    const [authToken, setAuthToken] = useImmer(null)

    const baseUrl = 'http://192.168.9.106:3000/api';
    const axiosInstance = axios.create({
        baseUrl,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    })

    const fetchUser = async (token) => {
        let response = await axios.post(`${baseUrl}/users/getUserData`, token)
        console.log(response.data);
        if (response) {
            console.log(response.data)
            setcurrentUser(response.data.user)
        } else {
            console.log("Something Went Wrong");
            return null
        }
    }

    const handleLogin = async () => {
        const response = await axios.post(`${baseUrl}/users/login`, authenticationInfo)
        console.log(response.data.token);
        if (response.data.success) {
            const token = response.data.token
            // await AsyncStorage.setItem('jwt', token);
            setAuthToken(token)
            // navigation.navigate('Main')
            return 'logged'
        } else {
            console.log(response.data.error);
        }

    }
    const handleRegister = async () => {
        try {
            let response = await userService.register(authenticationInfo)
            let token = response.data.token;
            if (response.data.success) {
                await AsyncStorage.setItem('jwt', token);
                const currentUser = await fetchUser(token)
                console.log('registered')
                console.log(currentUser)
                navigation.navigate('Main')
                return "registered"
            } else {
                return response.data.error
            }
        } catch (error) {
            return 'Register failed!'
        }
    }



    React.useEffect(() => { console.log(currentUser); }, [currentUser])
    React.useEffect(() => { fetchUser(authToken) }, [authToken])

    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView>
                    <SafeAreaView>
                        <View style={{ height: 80 }}></View>
                        <FontAwesome5 name="spotify" size={80} style={{ textAlign: 'center' }} color="white" />
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 40 }}>Billions of Songs Free on IVY</Text>
                        <View style={{ height: 80 }}></View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor='#C0C0C0'
                            value={authenticationInfo.email}
                            onChangeText={(e) => setAuthenticationInfo(draft => {
                                draft.email = e
                            })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor='#C0C0C0'
                            value={authenticationInfo.password}
                            onChangeText={(e) => setAuthenticationInfo(draft => {
                                draft.password = e
                            })}
                        />
                        <Pressable on onPress={() => handleLogin()} style={({ pressed }) => pressed ? styles.buttonPressed : styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                        <Pressable onPress={() => handleRegister()} style={({ pressed }) => pressed ? styles.buttonPressed : styles.button}>
                            {/* <MaterialIcons name="phone-android" size={24} color="white" /> */}
                            <Text style={styles.buttonText}>Register</Text>
                        </Pressable>
                        {/* <Pressable style={{ backgroundColor: "#131624", padding: 10, marginLeft: 'auto', marginRight: 'auto', width: 300, borderRadius: 300, alignItems: 'center', borderColor: "#C0C0C0", borderWidth: 0.8, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }}>
                    <AntDesign name="google" size={24} color="white" />
                    <Text style={{ fontWeight: "500", color: 'white', textAlign: 'center', flex: 1 }}>Continue with Google</Text>
                </Pressable> */}
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView >
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    input: {
        backgroundColor: 'transparent',
        borderColor: '#C0C0C0',
        borderWidth: 0.8,
        padding: 10,
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 300,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    button: {
        backgroundColor: "#131624",
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 300,
        borderRadius: 300,
        alignItems: 'center',
        borderColor: "#C0C0C0",
        borderWidth: 0.8,
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    buttonPressed: {
        backgroundColor: 'green',
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 300,
        borderRadius: 300,
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