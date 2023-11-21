import * as React from 'react';
import { Text, View, StyleSheet, Button, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { songStateAtom, soundPlayingAtom, routingStateAtom } from '../store';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import axios from 'axios'
import { baseUrl } from '../screens/LoginScreen';
import { defaultSong } from '../store';

export default function AudioPlayer({ visible = true }) {
    const [allSongs, setAllSongs] = React.useState();
    const [songState, setSongState] = useAtom(songStateAtom)
    const [sound, setSound] = useAtom(soundPlayingAtom)
    const [routingState, setRoutingState] = useAtom(routingStateAtom)


    const loadAudio = async (songURL = defaultSong.songURL) => {
        try {
            const { sound: song, status } = await Audio.Sound.createAsync(
                { uri: songURL }, 
                { shouldPlay: true },

            );

            song.setOnPlaybackStatusUpdate((sng) => setSongState(prev => ({
                ...prev,
                progress: Number((sng.positionMillis / sng.durationMillis).toFixed(3)),
                currentTime: Number((sng.positionMillis)),
                durationTime: Number((sng.durationMillis)),
            })))

            await song.playAsync()
            setSound(song);
            setSongState(prev => ({
                ...prev,
                isPlaying: true
            }))
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
                console.log("handlePlayPause");
                if (isPlaying) {
                    await sound.pauseAsync();
                    setSongState(prev => (
                        {
                            ...prev,
                            isPlaying: !isPlaying
                        }
                    ))
                } else {
                    await sound.playAsync()
                    setSongState(prev => (
                        {
                            ...prev,
                            isPlaying: !isPlaying
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
    const handleSongState = async (state = true | false) => {
        try {
            if (sound) {
                if (!state) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync()
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
            console.log("handleRandom");

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
        if (songState.progress == 1) {
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
    }, [songState.progress])

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
        try {
            if (!songState.isPlaying) {
                sound.pauseAsync()
            } else {
                sound.playAsync()
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }

    }, [songState.isPlaying]);

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    return (

        <View style={{
            opacity: visible ? 1 : 0, width: "100%",
            bottom: 50,
            right: 0,
            left: 0,
            position: "absolute",
            alignSelf: "center",
            justifyContent: "center",
        }}>
            <View style={styles.player}>

                <View style={{ width: '15%' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'white' }}>{songState.song?.name}</Text>
                </View>
                <Pressable style={styles.icon} onPress={handleRandom}>
                    <FontAwesome5 name="random" size={24} color={songState?.isRandom ? '#FD841F' : 'white'} />
                </Pressable>
                <Pressable style={styles.icon} onPress={() => handleNextPreviousSong(allSongs[songState.index - 1], songState.index - 1)}>
                    <FontAwesome5 name="step-backward" size={24} color="white" />
                </Pressable>
                <Pressable style={styles.icon} onPress={handlePlayPause}>
                    {songState?.isPlaying ? <FontAwesome5 name="pause" size={24} color="white" /> : < FontAwesome5 name="play" size={24} color="white" />
                    }
                </Pressable>
                <Pressable style={styles.icon} onPress={() => {
                    let index = songState.index + 1
                    if (songState.isRandom) {
                        index = Math.floor(Math.random() * allSongs.length)
                    }

                    handleNextPreviousSong(allSongs[index], index)
                }}>
                    <FontAwesome5 name="step-forward" size={24} color="white" />
                </Pressable>
                <Pressable style={styles.icon} onPress={handleRepeat} >
                    {songState?.isRepeat ? <MaterialIcons name="repeat-one" size={24} color="#FD841F" /> : <MaterialIcons name="repeat" size={24} color="white" />}
                </Pressable>
            </View>
            <View>
                <ProgressBar progress={Number.isNaN(songState.progress) ? 0 : songState.progress} color={MD3Colors.error50} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        bottom: 50,
        right: 0,
        left: 0,
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
    },
    player: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#000000',
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
        height: 70,
        left: 0,
        right: 0,
    },
});
