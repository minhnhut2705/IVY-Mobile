import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Pressable, Image, ImageBackground, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'
import Slider from '@react-native-community/slider';
import { songStateAtom } from '../store';
import { useAtom } from 'jotai';
import { defaultSong } from '../components/Player';
import { MD3Colors } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

const FloatingAudioPlayer = () => {
    const [sound, setSound] = React.useState();
    const [allSongs, setAllSongs] = React.useState();
    const [songState, setSongState] = useAtom(songStateAtom)
    const [progress, setProgress] = React.useState(0);
    const loadAudio = async (songURL = defaultSong.songURL) => {
        try {
            const { sound: song, status } = await Audio.Sound.createAsync(
                { uri: songURL }, // Replace with the path to your audio file
                { shouldPlay: false }, (status) => {
                    setProgress(Number((status.positionMillis / status.durationMillis).toFixed(3)))
                    // if (status.didJustFinish && songState.isRepeat) {
                    //     song.playAsync()
                    // }
                }
            );
            await song.playAsync()
            setSound(song);
            setSongState(prev => ({
                ...prev,
                isPlaying: true

            }))
            // setdurationMillis(status.durationMillis / 1000)
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    const handlePlayPause = async () => {
        try {

            if (sound) {
                const { isPlaying } = await sound.getStatusAsync();
                if (isPlaying) {
                    await sound.pauseAsync();
                    setSongState(prev => (
                        {
                            ...prev,
                            isPlaying: false
                        }
                    ))
                } else {
                    await sound.playAsync()
                    setSongState(prev => (
                        {
                            ...prev,
                            isPlaying: true
                        }
                    ))


                }
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };


    const getAllSongs = async () => {
        try {
            const response = await axios.get(`${baseUrl}/songs`)
            setAllSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }
    const handleRepeat = async () => {
        try {
            setSongState(prev => (
                {
                    ...prev,
                    isRepeat: !songState.isRepeat
                }
            ))
            const x = await sound?.setIsLoopingAsync(true)
            console.log('====================================');
            console.log("x", x);
            console.log('====================================');

        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };


    const handleRandom = async () => {
        try {
            setSongState(prev => (
                {
                    ...prev,
                    isRandom: !songState.isRandom
                }
            ))
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    const handleNextPreviousSong = async (song, index) => {
        try {
            setSongState(prev => (
                {
                    ...prev,
                    song: song,
                    index: index
                }
            ))
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    React.useEffect(() => {
        getAllSongs()
    }, [])

    React.useEffect(() => {
        if (progress == 1) {
            if (songState.isRepeat) {
                loadAudio(songState.song.songURL)
            } else {
                let index = songState.index + 1
                if (songState.isRandom) {
                    index = Math.floor(Math.random() * allSongs.length)
                }
                loadAudio(allSongs[index].songURL)
                setSongState(prev => ({
                    ...prev,
                    song: allSongs[index],
                    index: index
                }))
            }
        }
    }, [progress])

    React.useEffect(() => {
        if (sound) {
            sound.unloadAsync();
        }
        loadAudio(songState.song?.songURL);
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [songState.song?.songURL]);

    React.useEffect(() => {
        // handleState()
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <>
            <StatusBar style='light'></StatusBar>
            {/* <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}> */}
            <SafeAreaView style={styles.container}>
                <ImageBackground source={{ uri: defaultSong.thumbnail }} resizeMode="cover" style={styles.imageBackground} blurRadius={16}>
                    <View
                        style={{
                            // marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Ionicons name="arrow-back" size={36} color="black" />
                    </View>
                    <View
                        style={{
                            // marginVertical: 5,
                            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Image style={{ height: 380, width: 380, borderRadius: 12 }} source={{ uri: defaultSong.thumbnail }} />
                    </View>

                    <View
                        style={{
                            // marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Text style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}>
                            {defaultSong.name}

                        </Text>
                    </View>
                    <View
                        style={{
                            // marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Text style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "light",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}>
                            Diệu Kiên

                        </Text>
                    </View>
                    <View style={{ height: 20 }} />
                    <View
                        style={{
                            // marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Slider style={{ width: 380, height: 20, marginTop: 20 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={0.3}
                            onValueChange={(value) => console.log('Value:', value)}
                            step={0.01}
                            thumbTintColor={MD3Colors.error50}
                            minimumTrackTintColor={MD3Colors.error50}
                            maximumTrackTintColor={MD3Colors.tertiary90}
                        />
                    </View>

                    <View
                        style={{
                            // marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            alignItems: "space-between",
                            gap: 10,
                            width: 380
                        }}
                    >
                        <Text style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                        }}>
                            01:35
                        </Text>
                        <Text style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                        }}>
                            04:25
                        </Text>
                    </View>

                    <View
                        style={{
                            // marginVertical: 5,
                            flex: 1,
                            // marginTop: 60,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            alignItems: "center",
                            width: 380,
                            bottom: 30
                        }}
                    >
                        <Pressable style={styles.icon} onPress={handleRandom}>
                            <FontAwesome5 name="random" size={36} color={songState?.isRandom ? '#FD841F' : 'white'} />
                        </Pressable>
                        <Pressable style={styles.icon} onPress={() => handleNextPreviousSong(allSongs[songState.index - 1], songState.index - 1)}>
                            <FontAwesome5 name="step-backward" size={36} color="white" />
                        </Pressable>
                        <Pressable style={styles.playPauseButton} onPress={handlePlayPause}>
                            {songState?.isPlaying ? <FontAwesome5 name="pause" size={36} color="#131624" /> : < FontAwesome5 name="play" size={36} color="#131624" />
                            }
                        </Pressable>
                        <Pressable style={styles.icon} onPress={() => {
                            let index = songState.index + 1
                            if (songState.isRandom) {
                                index = Math.floor(Math.random() * allSongs.length)
                            }
                            console.log('====================================');
                            console.log("index", index);
                            console.log('====================================');

                            handleNextPreviousSong(allSongs[index], index)
                        }}>
                            <FontAwesome5 name="step-forward" size={36} color="white" />
                        </Pressable>
                        <Pressable style={styles.icon} onPress={handleRepeat} >
                            {songState?.isRepeat ? <MaterialIcons name="repeat-one" size={36} color="#FD841F" /> : <MaterialIcons name="repeat" size={36} color="white" />}
                        </Pressable>
                    </View>
                </ImageBackground>
            </SafeAreaView>
            {/* </LinearGradient > */}
        </>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        marginBottom: Platform.OS === 'android' ? 50 : 0,
    },
    playPauseButton: {
        backgroundColor: MD3Colors.secondary80,
        padding: 14,
        borderRadius: 22
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
    }

});

export default FloatingAudioPlayer;
