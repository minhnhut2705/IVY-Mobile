import * as React from 'react';
import { Text, View, StyleSheet, Button, Pressable, ProgressBarAndroid } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { songStateAtom, playingSongAtom } from '../store';
export default function AudioPlayer() {
    const [sound, setSound] = React.useState();
    const [songState, setSongState] = useAtom(songStateAtom)
    const [playingSong, setplayingSong] = useAtom(songStateAtom)
    const [durationMillis, setdurationMillis] = React.useState();
    const [positionMillis, setPositionMillis] = React.useState(0);
    // 'https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/mp3%2FDemons1683259252539?alt=media&token=e5189d6a-5fa0-45fb-98ee-092f751d4089'
    const loadAudio = async (songURL = 'https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/mp3%2FDemons1683259252539?alt=media&token=e5189d6a-5fa0-45fb-98ee-092f751d4089') => {
        try {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: songURL }, // Replace with the path to your audio file
                { shouldPlay: false }, (status) => setPositionMillis(status.positionMillis)
            );
            setSound(sound);
            setdurationMillis(status.durationMillis)
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    const handlePlayPause = async () => {
        try {
            if (sound) {
                const { isPlaying, positionMillis, durationMillis } = await sound.getStatusAsync();
                console.log(positionMillis, durationMillis);
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




    React.useEffect(() => {
        loadAudio();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    React.useEffect(() => {
        loadAudio(songState?.songURL);
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [songState.songURL]);

    // React.useEffect(() => {
    //     return sound
    //         ? () => {
    //             console.log('Unloading Sound');
    //             sound.unloadAsync();
    //         }
    //         : undefined;
    // // }, [sound]);

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
            <Pressable style={styles.icon} onPress={handleRandom}>
                    <FontAwesome5 name="random" size={24} color={songState?.isRandom ? '#FD841F' : 'white'} />
            </Pressable>
            <Pressable style={styles.icon}>
                <FontAwesome5 name="step-backward" size={24} color="white" />
            </Pressable>
            <Pressable style={styles.icon} onPress={handlePlayPause}>
                    {songState?.isPlaying ? <FontAwesome5 name="pause" size={24} color="white" /> : < FontAwesome5 name="play" size={24} color="white" />
                }
            </Pressable>
            <Pressable style={styles.icon}>
                <FontAwesome5 name="step-forward" size={24} color="white" />
            </Pressable>
            <Pressable style={styles.icon} onPress={handleRepeat} >
                    {songState?.isRepeat ? <MaterialIcons name="repeat-one" size={24} color="#FD841F" /> : <MaterialIcons name="repeat" size={24} color="white" />}
            </Pressable>
            </View>
            <View>
                <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={positionMillis / durationMillis}
                    color="#2196F3" // You can customize the color
                />
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
        left: 0,
        right: 0,
    },
});
