import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Pressable, Image, ImageBackground, SafeAreaView, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'
import Slider from '@react-native-community/slider';
import { songStateAtom, soundPlayingAtom } from '../store';
import { useAtom } from 'jotai';
import { defaultSong } from '../components/Player';
import { MD3Colors } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import { useNavigation } from '@react-navigation/native'

const FloatingAudioPlayer = () => {
    const [sound, setSound] = useAtom(soundPlayingAtom);
    const [allSongs, setAllSongs] = React.useState();
    const [artistOfSong, setArtistOfSong] = React.useState();
    const [songState, setSongState] = useAtom(songStateAtom)
    const navigation = useNavigation()
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

    const getArtistOfSong = async (artistId) => {
        try {
            const response = await axios.get(`${baseUrl}/artists/${artistId}`)
            setArtistOfSong(response.data.artist)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePositionOfSong = async (position) => {
        try {
            if (sound) {
                await sound.setPositionAsync(position * songState.durationTime)
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };
    const handleRepeat = async () => {
        try {
            setSongState(prev => (
                {
                    ...prev,
                    isRepeat: !songState.isRepeat
                }
            ))


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

    const updateSongStream = async (song) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/update/${song._id}/stream`, { song: song })
            return response
        } catch (error) {
            console.log(error);
            return null
        }
    }

    const handleNextPreviousSong = async (song, index) => {
        try {
            const response = await updateSongStream({ ...song, stream: song.stream + 1 })
            setSongState(prev => (
                {
                    ...prev,
                    song: response.data.song,
                    index: index
                }
            ))

        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    const convertTime = (time) => {
        var minutes = Number(Math.floor(time / 60))
        minutes = (Number(minutes) >= 10) ? minutes : "0" + (Number.isNaN(minutes) ? '0' : minutes)
        var seconds = Math.floor(time % 60)
        seconds = (Number(seconds) >= 10) ? seconds : "0" + (Number.isNaN(seconds) ? '0' : seconds)

        return minutes + ':' + seconds
    }

    React.useEffect(() => {
        getAllSongs()
    }, [])

    React.useEffect(() => {
        getArtistOfSong(songState.song.artist[0])
    }, [songState.song])

    React.useEffect(() => {
        if (songState.progress == 1) {
            if (songState.isRepeat) {
                setSongState(prev => ({
                    ...prev,
                    song: allSongs[songState.index],
                    index: songState.index
                }))
            } else {
                let index = songState.index + 1
                if (songState.isRandom) {
                    index = Math.floor(Math.random() * allSongs.length)
                }
                setSongState(prev => ({
                    ...prev,
                    song: allSongs[index],
                    index: index
                }))
            }
        }
    }, [songState.progress])

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
        songState.song._id && <>
            <StatusBar style='light'></StatusBar>
            <SafeAreaView style={styles.container}>
                <ImageBackground source={{ uri: songState.song?.thumbnail }} resizeMode="cover" style={styles.imageBackground} blurRadius={16}>
                    <Pressable
                        onPress={() => navigation.navigate('Home')}
                        style={{
                            flexDirection: "row",
                            justifyContent: 'start',
                            alignItems: "center",
                            paddingHorizontal: 10,
                            gap: 10,
                        }}
                    >
                        <Ionicons name="arrow-back" size={36} color="white" />
                    </Pressable>
                    <View
                        style={{
                            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Image style={{ height: 380, width: 380, borderRadius: 12 }} source={{ uri: songState.song?.thumbnail }} />
                    </View>
                    <View
                        style={{
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
                            {songState.song?.name}

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
                        <Text numberOfLines={2} ellipsizeMode='tail' style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "light",
                            marginHorizontal: 10,
                            marginTop: 10,
                            textAlign: "center",
                            justifyContent: 'center'
                        }}>
                            {artistOfSong?.name}
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
                        <Slider style={{ width: 380, height: 40, marginTop: 20 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={Number.isNaN(songState.progress) ? 0 : songState.progress}
                            onValueChange={(value) => handlePositionOfSong(value)}
                            step={0.0001}
                            thumbTintColor={MD3Colors.error50}
                            minimumTrackTintColor={MD3Colors.error50}
                            maximumTrackTintColor={MD3Colors.tertiary90}
                            lowerLimit={0}
                            upperLimit={1}
                        />
                    </View>

                    <View
                        style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            alignItems: "space-between",
                            gap: 10,
                            marginBottom: 30,
                            width: 380
                        }}
                    >
                        <Text style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                        }}>
                            {convertTime(songState.currentTime / 1000)}
                        </Text>
                        <Text style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                        }}>
                            {convertTime(songState.durationTime / 1000)}
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
                        <Pressable style={styles.icon} onPress={() => handleNextPreviousSong(allSongs[Number(songState.index) - 1], Number(songState.index) - 1)}>
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
                            handleNextPreviousSong(allSongs[Number(index)], Number(index))
                        }}>
                            <FontAwesome5 name="step-forward" size={36} color="white" />
                        </Pressable>
                        <Pressable style={styles.icon} onPress={handleRepeat} >
                            {songState?.isRepeat ? <MaterialIcons name="repeat-one" size={36} color="#FD841F" /> : <MaterialIcons name="repeat" size={36} color="white" />}
                        </Pressable>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        marginBottom: Platform.OS === 'android' ? 50 : 0, 
        backgroundColor: 'black',
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
