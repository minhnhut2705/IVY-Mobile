import React, { useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const AudioPlayer = () => {
    useEffect(() => {
        // Initialize the player when the component mounts
        TrackPlayer.setupPlayer().then(async () => {
            // Add an audio track to the player
            await TrackPlayer.add({
                id: 'trackId',
                url: 'your_audio.mp3', // Replace with the path to your audio file
                title: 'Audio Title',
                artist: 'Audio Artist',
            });
        });

        return () => {
            // Release resources when the component unmounts
            TrackPlayer.destroy();
        };
    }, []);

    const playAudio = async () => {
        await TrackPlayer.play();
    };

    const pauseAudio = async () => {
        await TrackPlayer.pause();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Audio Player</Text>
            <Button title="Play" onPress={playAudio} />
            <Button title="Pause" onPress={pauseAudio} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default AudioPlayer;
