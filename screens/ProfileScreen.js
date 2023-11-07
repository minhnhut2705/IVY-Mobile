import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native'
import React from 'react'

export default function ProfileScreen() {
    const { width, height } = Dimensions.get('window')

    return (
        <SafeAreaView style={styles.container}>
            <View>
            <Text>ProfileScreen</Text>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
})