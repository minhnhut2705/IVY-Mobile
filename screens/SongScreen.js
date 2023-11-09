import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';

const FloatingAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    // useEffect(() => {
    //     // Initialize audio player
    //     Audio.setAudioModeAsync({
    //         allowsRecordingIOS: false,
    //         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    //         playsInSilentModeIOS: true,
    //         shouldDuckAndroid: true,
    //         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    //         playThroughEarpieceAndroid: false,
    //     });
    // }, []);

    const handlePlayPause = async () => {
        try {
            if (isPlaying) {
                await Audio.pauseAsync();
            } else {
                await Audio.playAsync(
                    { uri: 'https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/mp3%2FDemons1683259252539?alt=media&token=e5189d6a-5fa0-45fb-98ee-092f751d4089' }, // Replace with the path to your audio file
                    // { shouldPlay: true }
                );
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePlayPause}>
                <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        backgroundColor: 'lightgray',
        padding: 10,
        alignItems: 'center',
    },
});

export default FloatingAudioPlayer;
