import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons"
export default function LoginScreen() {
    const authenticate = async () => {

    }

    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <SafeAreaView>
                <View style={{ height: 80 }}></View>
                <FontAwesome5 name="spotify" size={80} style={{ textAlign: 'center' }} color="white" />
                <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 40 }}>Billions of Songs Free on IVY</Text>
                <View style={{ height: 80 }}></View>
                <Pressable onPress={authenticate} style={{ backgroundColor: "#1D8954", padding: 10, marginLeft: 'auto', marginRight: 'auto', width: 300, borderRadius: 300, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <Text>Sign in with IVY</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: "#131624", padding: 10, marginLeft: 'auto', marginRight: 'auto', width: 300, borderRadius: 300, alignItems: 'center', borderColor: "#C0C0C0", borderWidth: 0.8, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }}>
                    <MaterialIcons name="phone-android" size={24} color="white" />
                    <Text style={{ fontWeight: "500", color: 'white', textAlign: 'center', flex: 1 }}>Continue with phone number</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: "#131624", padding: 10, marginLeft: 'auto', marginRight: 'auto', width: 300, borderRadius: 300, alignItems: 'center', borderColor: "#C0C0C0", borderWidth: 0.8, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }}>
                    <AntDesign name="google" size={24} color="white" />
                    <Text style={{ fontWeight: "500", color: 'white', textAlign: 'center', flex: 1 }}>Continue with Google</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: "#131624", padding: 10, marginLeft: 'auto', marginRight: 'auto', width: 300, borderRadius: 300, alignItems: 'center', borderColor: "#C0C0C0", borderWidth: 0.8, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }}>
                    <Entypo name="facebook" size={24} color="blue" />
                    <Text style={{ fontWeight: "500", color: 'white', textAlign: 'center', flex: 1 }}>Continue with Facebook</Text>
                </Pressable>
            </SafeAreaView>
        </LinearGradient >
    )
}

const styles = StyleSheet.create({})