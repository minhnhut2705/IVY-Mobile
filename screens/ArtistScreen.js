import { StyleSheet, Image, Text, View, FlatList, StatusBar, Platform, Pressable, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import { currentUserAtom, songStateAtom, routingStateAtom } from '../store';
import { useAtom } from 'jotai';
import Header from '../components/Header';
import { MD3Colors } from 'react-native-paper';
import _ from 'lodash'
import { useFocusEffect } from '@react-navigation/native';

const ArtistScreen = ({ navigation, route }) => {
    const [topSongs, setTopSongs] = React.useState([])
    const [allSongs, setAllSongs] = React.useState([])
    const [artistOfSong, setArtistOfSong] = React.useState();
    const [songState, setSongState] = useAtom(songStateAtom)
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
    const [routingState, setRoutingState] = useAtom(routingStateAtom)

    const artistId = route.params?.artistId ? route.params.artistId : songState.song.artist[0]



    useFocusEffect(
        React.useCallback(() => {
            setRoutingState({ key: "Artist", name: "Artist", params: null })
        }, [])
    );

    React.useEffect(() => {
        if (artistId) {
            getArtistOfSong(artistId)
        } else {
            getArtistOfSong(songState.song.artist[0])
        }
    }, [artistId])

    React.useEffect(() => {
        if (artistOfSong) {
            getSongsByArrayOfId(artistOfSong?.songs)
        }
    }, [artistOfSong])

    const getArtistOfSong = async (artistId) => {
        try {
            const response = await axios.get(`${baseUrl}/artists/${artistId}`)
            setArtistOfSong(response.data.artist)
        } catch (error) {
            console.log(error);
        }
    }

    const getSongsByArrayOfId = async (songIDs) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/searchSongs`, { songIDs: songIDs })
            setAllSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }
    const updateUserRecentlyPlayed = async (userId, songsPlayed) => {
        try {
            const response = await axios.patch(`${baseUrl}/users/updateRecentlyPlayed/${userId}`, { recentlyPlayed: songsPlayed })
            setCurrentUser(response.data.user)
        } catch (error) {
            console.log(error);
        }
    }
    // const updateSongStream = async (songId, stream) => {
    //     try {
    //         await axios.patch(`${baseUrl}/songs/update/${songId}/stream`, { stream: stream })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const updateSongStream = async (song) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/update/${song._id}/stream`, { song: song })
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            return response
        } catch (error) {
            console.log(error);
            return null
        }
    }


    const setPlayingSong = async (song, index) => {
        try {
            setSongState(prev => (
                {
                    ...prev,
                    index: index,
                    song: song
                }
            ))
            if (currentUser) {
                const playedSongs = currentUser.recentlyPlayed.includes(song._id) ? currentUser.recentlyPlayed : [...currentUser.recentlyPlayed, song._id]

                await updateUserRecentlyPlayed(currentUser._id, playedSongs)
                await updateSongStream({ ...song, stream: song.stream + 1 })
                // await getTopSongs(6)
            }
        } catch (error) {
            console.log(error);
        }
    }



    const renderSong = ({ item, index }) => {
        return (
            <Pressable
                style={({ pressed }) => pressed ? styles.topSongsItemPressed : styles.topSongsItem}

                onPress={() => setPlayingSong(item, index)}
            >
                <Image
                    style={{ height: 55, width: 55 }}
                    source={{ uri: item.thumbnail }}
                />
                <View
                    style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}
                >
                    <Text
                        numberOfLines={2}
                        style={{ fontSize: 13, fontWeight: "bold", color: "white" }}
                    >
                        {item.name}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return <>
        <StatusBar style='light'></StatusBar>
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ marginBottom: Platform.OS == 'android' ? 70 : 0 }}>
                    <Header></Header>
                    <View style={{ height: 10 }} />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginHorizontal: 10,
                        }}
                    >
                        <Image
                            style={{ height: 120, width: 120, borderRadius: 10, marginRight: 10, borderColor: MD3Colors.neutralVariant50, borderWidth: 1 }}
                            source={{ uri: artistOfSong?.avatar }}
                        />
                        <View style={{ justifyContent: 'space-around', flexDirection: 'column' }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{ fontSize: 24, fontWeight: "bold", color: "white", flex: 1 }}
                            >
                                {artistOfSong?.name}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{ fontSize: 16, fontWeight: "bold", color: "white", flex: 1 }}
                            >
                                Songs: {artistOfSong?.songs.length}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{ fontSize: 16, fontWeight: "bold", color: "white", flex: 1 }}
                            >
                                Streams: {_.sumBy(allSongs, 'stream')}
                            </Text>

                        </View>

                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 19,
                                fontWeight: "bold",
                                marginHorizontal: 10,
                                marginTop: 10,
                            }}
                        >
                            All songs of {artistOfSong?.name}
                        </Text>
                    </View>

                    <ScrollView >
                        <FlatList
                            data={allSongs}
                            renderItem={renderSong}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                        />
                    </ScrollView>
                </ScrollView >
                {/* <AudioPlayer></AudioPlayer> */}
            </SafeAreaView>
        </LinearGradient >
    </>
}

export default ArtistScreen

const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: Platform.OS === 'android' ? 50 : 0 },
    loadingContainer: { flex: 1, marginBottom: Platform.OS === 'android' ? 50 : 0, backgroundColor: "#000000", },
    button: {
        backgroundColor: "#131624",
        paddingVertical: 10,
        width: 150,
        borderRadius: 10,
        fontWeight: '900',
        alignItems: 'center',
        borderColor: "#C0C0C0",
        borderWidth: 0.8,
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    buttonPressed: {
        backgroundColor: "green",
        paddingVertical: 10,
        width: 150,
        borderRadius: 10,
        fontWeight: '900',
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
    },
    topSongsItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
        elevation: 3,
    },
    topSongsItemPressed: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: MD3Colors.error50,
        borderRadius: 4,
        elevation: 3,
    }
})