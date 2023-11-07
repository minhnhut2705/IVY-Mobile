import { StyleSheet, Text, View, SafeAreaView, Pressable, ToastAndroid, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import * as React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons"
import { useImmer } from 'use-immer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../services/user.service'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

export const baseUrl = 'http://192.168.9.106:3000/api';
export const axiosInstance = axios.create({
    baseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

export default function LoginScreen() {
    const [authenticationInfo, setAuthenticationInfo] = useImmer({ email: '', password: '' })
    const [authToken, setAuthToken] = useImmer(null)
    const navigation = useNavigation()

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${baseUrl}/users/login`, authenticationInfo)
            console.log(response.data);
            if (response.data.success) {
                const token = response.data.token
                await AsyncStorage.setItem('jwt', token)
                navigation.navigate('Main')
                ToastAndroid.show('Logged in', ToastAndroid.SHORT)
                return true
            } else {
                console.log(response.data.error, ",");
                ToastAndroid.showWithGravity('Log in failed !', ToastAndroid.SHORT, ToastAndroid.TOP)

            }
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravity('Log in failed !', ToastAndroid.SHORT, ToastAndroid.TOP) 
        }

    }
    const handleRegister = async () => {
        try {
            const response = await axios.post(`${baseUrl}/users/register`, authenticationInfo)
            console.log(response.data);
            if (response.data.success) {
                const token = response.data.token
                await AsyncStorage.setItem('jwt', token);
                setAuthToken(token)
                navigation.navigate('Main')
                ToastAndroid.show('Registered!', ToastAndroid.SHORT)
                return true
            } else {
                console.log(response.data.error, ",");
                ToastAndroid.showWithGravity('Register failed !', ToastAndroid.SHORT, ToastAndroid.TOP)

            }
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravity('Register failed !', ToastAndroid.SHORT, ToastAndroid.TOP)
        }
    }

    // React.useEffect(() => { fetchUser(authToken) }, [authToken])

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
                            secureTextEntry={true}
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