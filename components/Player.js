import * as React from 'react';
import { Text, View, StyleSheet, Button, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { songStateAtom, playingSongAtom } from '../store';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import axios from 'axios'
import { baseUrl } from '../screens/LoginScreen';

export const defaultSong = {
    _id: "641c50234ab39bd00e7c6d80",
    name: "Xuôi Dòng Cửu Long",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/img%2Fsongs%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.jpg?alt=media&token=dd95cc1b-28c1-4dd4-aaba-f7d54c826ae8",
    banner: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/img%2Fsongs%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.jpg?alt=media&token=dd95cc1b-28c1-4dd4-aaba-f7d54c826ae8",
    songURL: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/mp3%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.mp3?alt=media&token=b19d42bb-7668-4f85-bad9-76f43690b849",
    artist: [
        "641c58a94ab39bd00e7c6daa"
    ],
    stream: 1,
    genres: [
        "6364705f45683df115923736"
    ],
    type: "system",
    createdAt: "2023-03-23T13:12:03.414Z"
    ,
    updatedAt: "2023-10-12T14:02:33.965Z"
    ,
    __v: 0
}

export default function AudioPlayer() {
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

    // const handleState = async () => {
    //     try {
    //         if (sound) {
    //             const { isPlaying } = await sound.getStatusAsync();
    //             if (isPlaying) {
    //                 setSongState(draft => {
    //                     draft.isPlaying = false
    //                 })
    //             } else {
    //                 setSongState({ ...songState, isPlaying: false })

    //             }
    //         }
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log(error);
    //         console.log('====================================');
    //     }
    // }
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

        <View>
            <View style={styles.container}>

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
                    console.log('====================================');
                    console.log("index", index);
                    console.log('====================================');

                    handleNextPreviousSong(allSongs[index], index)
                }}>
                    <FontAwesome5 name="step-forward" size={24} color="white" />
                </Pressable>
                <Pressable style={styles.icon} onPress={handleRepeat} >
                    {songState?.isRepeat ? <MaterialIcons name="repeat-one" size={24} color="#FD841F" /> : <MaterialIcons name="repeat" size={24} color="white" />}
                </Pressable>
            </View>
            <View>
                <ProgressBar progress={Number.isNaN(progress) ? 0 : progress} color={MD3Colors.error50} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
