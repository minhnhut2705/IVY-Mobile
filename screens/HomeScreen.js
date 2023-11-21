import { StyleSheet, Image, Text, View, FlatList, StatusBar, Platform, Pressable, ScrollView, SafeAreaView, } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard'
import ArtistCard from '../components/ArtistCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currentUserAtom, songStateAtom, routingStateAtom } from '../store';
import { useAtom } from 'jotai';
import Header from '../components/Header';
import AudioPlayer from '../components/Player';
import GenreCard from '../components/GenreCard'
import PlaylistCard from '../components/PlaylistCard'
import { MD3Colors } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
const HomeScreen = ({ route }) => {
    const navigation = useNavigation()
    const [topSongs, setTopSongs] = React.useState([])
    const [allSongs, setAllSongs] = React.useState([])
    const [favoriteSongs, setFavoriteSongs] = React.useState([])
    const [recentlyPlayedSongs, setRecentlyPlayedSongs] = React.useState([])
    const [topArtists, setTopArtists] = React.useState([])
    const [allGenres, setAllGenres] = React.useState([])
    const [allPlaylists, setAllPlaylists] = React.useState([])
    const [songState, setSongState] = useAtom(songStateAtom)
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
    const [routingState, setRoutingState] = useAtom(routingStateAtom)

    useFocusEffect(
        React.useCallback(() => {
            setRoutingState({ key: "Home", name: "Home", params: null })
        }, [])
    );
    React.useEffect(() => {
        getTopSongs(6)
        geTopArtists(10)
        getAllGenres()
        getAllPlaylists()
    }, [])

    React.useEffect(() => {
        if (currentUser) {
            getFavoriteSongs(currentUser.favorites)
            getRecentlyPlayedSongs(currentUser.recentlyPlayed)
        }

    }, [currentUser])
    // React.useEffect(() => {
    //     if (currentUser) {
    //         updateUserRecentlyPlayed(currentUser._id, currentUser.recentlyPlayed)
    //     }

    // }, [currentUser?.recentlyPlayed])

    const getTopSongs = async (numOfSong) => {
        try {
            const response = await axios.post(`${baseUrl}/songs`, { numOfSong: numOfSong })
            setTopSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }
    const getAllGenres = async () => {
        try {
            const response = await axios.get(`${baseUrl}/genres`)
            setAllGenres(response.data.genres)
        } catch (error) {
            console.log(error);
        }
    }
    const getAllPlaylists = async () => {
        try {
            const response = await axios.get(`${baseUrl}/playlists`)
            setAllPlaylists(response.data.playlists)
        } catch (error) {
            console.log(error);
        }
    }
    const getFavoriteSongs = async (favoriteSongsId) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/getFavorites`, { favoriteSongsId: favoriteSongsId })
            setFavoriteSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }
    const getRecentlyPlayedSongs = async (recentlyPlayed) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/getRecentlyPlayed`, { recentlyPlayed: recentlyPlayed })
            setRecentlyPlayedSongs(response.data.songs)
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
    //         const response = await axios.patch(`${baseUrl}/songs/update/${songId}/stream`, { stream: stream })
    //         console.log('====================================');
    //         console.log("response.data.song.stream", response.data.song.stream);
    //         console.log('====================================');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const updateSongStream = async (song) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/update/${song._id}/stream`, { song: song })
            return response
        } catch (error) {
            console.log(error);
            return null
        }
    }
    const geTopArtists = async (numOfArtists) => {
        try {
            const response = await axios.post(`${baseUrl}/artists`, { numOfArtists: numOfArtists })
            setTopArtists(response.data.artists)
        } catch (error) {
            console.log(error);
        }
    }
    const setPlayingSong = async (song, index) => {
        try {
            await getTopSongs(6)
            const response = await updateSongStream({ ...song, stream: song.stream + 1 })
            setSongState(prev => (
                {
                    ...prev,
                    index: index,
                    song: response.data.song
                }
            ))
            if (currentUser) {
                const playedSongs = currentUser.recentlyPlayed.includes(song._id) ? currentUser.recentlyPlayed : [...currentUser.recentlyPlayed, song._id]
                await updateUserRecentlyPlayed(currentUser._id, playedSongs)
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
                            Top Songs
                        </Text>
                    </View>
                    <ScrollView >
                    <FlatList
                        data={topSongs}
                        renderItem={renderSong}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                    />
                    </ScrollView>

                    {currentUser && <>
                        <Text
                        style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}
                        >
                            Your Favorite Songs
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {favoriteSongs.map((item, index) => (
                                <Pressable style={{ margin: 10 }} onPress={() => setSongState(prev => ({
                                    ...prev,
                                    song: item,
                                    index: index
                                }))} key={index}>
                                    <Image
                                        style={{ width: 130, height: 130, borderRadius: 5 }}
                                        source={{ uri: item.thumbnail }}
                                    />
                                    <Text numberOfLines={1} ellipsizeMode="tail"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: "500",
                                            color: "white",
                                            marginTop: 10, width: 130
                                        }}
                                    >
                                        {item?.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <View style={{ height: 10 }} />
                        <Text
                        style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}
                    >
                        Recently Played
                    </Text>
                        <ScrollView horizontal={true}>
                            <FlatList
                                data={recentlyPlayedSongs}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => (
                                    <Pressable
                                        onPress={() =>
                                            setSongState(prev => ({
                                                ...prev,
                                                song: item,
                                                index: index
                                            }))
                                        }
                                        style={{ margin: 10 }}
                                        key={index}
                                    >
                                        <Image
                                            style={{ width: 130, height: 130, borderRadius: 5 }}
                                            source={{ uri: item?.thumbnail }}
                                        />
                                        <Text
                                            numberOfLines={1} ellipsizeMode="tail"
                                            style={{
                                                fontSize: 13,
                                                width: 130,
                                                fontWeight: "500",
                                                color: "white",
                                                marginTop: 10,
                                            }}
                                        >
                                            {item?.name}
                                        </Text>
                                    </Pressable>
                                )}
                            /> 
                        </ScrollView>
                    </>}

                    <View style={{ height: 10 }} />
                    <Text
                        style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}
                    >
                        Top Artists
                    </Text>
                    <ScrollView horizontal={true}>
                    <FlatList
                        data={topArtists}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <Pressable style={{ margin: 10 }} onPress={() => navigation.navigate('Artist', { artistId: item._id })}>
                                <Image
                                    style={{ width: 130, height: 130, borderRadius: 5 }}
                                    source={{ uri: item.avatar }}
                                />
                                <Text numberOfLines={1} ellipsizeMode="tail"
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "500",
                                        color: "white",
                                        marginTop: 10, width: 130
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </Pressable>
                        )}
                    />
                    </ScrollView>

                    {/* <Text
                            style={{
                                color: "white",
                                fontSize: 19,
                                fontWeight: "bold",
                                marginHorizontal: 10,
                                marginTop: 10,
                            }}
                        >
                            Genres
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, }}>
                            {
                                allGenres.map((item, index) => (
                                    <GenreCard item={item} key={index} />
                                ))
                            }
                        </View>
                        <View style={{ height: 10 }} /> */}
                    <Text
                        style={{
                            color: "white",
                            fontSize: 19,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginTop: 10,
                        }}
                    >
                        Playlists
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, }}>
                        {
                            allPlaylists.map((item, index) => (
                                <Pressable key={index} style={({ pressed }) => pressed ? styles.playlistBadgePressed : styles.playlistBadge} onPress={() => navigation.navigate('Playlist', { playlistId: item._id })}>
                                    <Image source={{ uri: item.thumbnail }} style={{ width: 69.5, height: 69.5, borderRadius: 5 }} />
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: "500",
                                        color: "white",
                                        marginTop: 10, width: 69.5
                                    }} numberOfLines={1} ellipsizeMode="tail"
                                    >
                                        {item?.name}
                                    </Text>
                                </Pressable>
                            ))
                        }
                    </View>
                    <View style={{ height: 10 }} />
                </ScrollView >
                {/* <AudioPlayer></AudioPlayer> */}
            </SafeAreaView>
        </LinearGradient >
    </>
}

export default HomeScreen

const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: Platform.OS === 'android' ? 50 : 0 },
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
    },
    playlistBadge: {
        borderRadius: 10,
        fontSize: 13,
        margin: 4,
        fontWeight: "500",
        color: "white",
        marginTop: 10,
        width: 'auto',
        padding: 10,
        backgroundColor: MD3Colors.neutral20
    },
    playlistBadgePressed: {
        borderRadius: 10,
        fontSize: 13,
        fontWeight: "500",
        margin: 4,
        color: "white",
        marginTop: 10,
        padding: 10,
        backgroundColor: MD3Colors.error50
    }
})