import {
    View, Text, Image, StatusBar, Pressable, ScrollView, useWindowDimensions, FlatList, SafeAreaView, StyleSheet
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SIZES, images } from "../constants";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import AudioPlayer from '../components/Player';
import { currentUserAtom, songStateAtom, routingStateAtom } from "../store";
import { useAtom } from "jotai";
import { MD3Colors } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { useFocusEffect } from '@react-navigation/native';


const Profilecreen = ({ route }) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [userSongs, setUserSongs] = React.useState([])
    const [userPlaylists, setUserPlaylists] = React.useState([])
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
    const [songState, setSongState] = useAtom(songStateAtom)
    const navigation = useNavigation()
    const [routes] = useState([
        { key: "first", title: "Songs" },
        { key: "second", title: "Playlist" },
    ]);    
    const [routingState, setRoutingState] = useAtom(routingStateAtom)

    useFocusEffect(
        React.useCallback(() => {
            setRoutingState({ key: "Profile", name: "Profile", params: null })
        }, [])
    );


    const renderSong = ({ item, index }) => {
        return (
            <Pressable
                style={({ pressed }) => pressed ? styles.userSongsItemPressed : styles.userSongsItem}

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
    const renderPlaylist = ({ item, index }) => {
        return (
            <Pressable
                style={({ pressed }) => pressed ? styles.userSongsItemPressed : styles.userSongsItem}

                onPress={() => navigation.navigate('Playlist', { playlistId: item._id })}
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

    const SongsRoute = () => (
        <View style={{
            flex: 1,
            backgroundColor: "#040306",
        }}>
            <FlatList
                data={userSongs}
                renderItem={renderSong}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>

    );

    const PlaylistsRoute = () => (
        <View style={{
            flex: 1,
            backgroundColor: "#040306",
        }}>
            <FlatList
                data={userPlaylists}
                renderItem={renderPlaylist}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>
    );
    const renderScene = SceneMap({
        first: SongsRoute,
        second: PlaylistsRoute,
    });

    React.useEffect(() => {
        console.log('====================================');
        console.log(currentUser);
        console.log('====================================');
        if (currentUser) {
            getUserSongs(currentUser.songs)
            getUserPlaylists(currentUser.playlists)
        } else {
            setSongState((prev) => ({
                ...prev,
                isPlaying: false
            }))
            setCurrentUser(null)
            navigation.navigate('Login')
        }
    }, [currentUser])
    const updateSongStream = async (song) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/update/${song._id}/stream`, { song: song })
            return response
        } catch (error) {
            console.log(error);
            return null
        }
    }

    const setPlayingSong = async (song, index) => {
        try {
            await getUserSongs(currentUser.songs)
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

    const getUserSongs = async (songIDs) => {
        try {
            const response = await axios.post(`${baseUrl}/songs/searchSongs`, { songIDs: songIDs })
            setUserSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }

    const getUserPlaylists = async (playlistIDs) => {
        try {
            const response = await axios.post(`${baseUrl}/playlists/searchPlaylists`, { playlistIDs: playlistIDs })
            setUserPlaylists(response.data.playlists)
        } catch (error) {
            console.log(error);
        }
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: MD3Colors.neutral70,
            }}
            style={{
                backgroundColor: '#282828',
                height: 44,
                borderRadius: 10
            }}
            activeColor="red"
            inactiveColor="blue"
            renderLabel={({ focused, route }) => (
                <Text style={[{ color: COLORS.white }]}>
                    {route.title}
                </Text>
            )}
        />
    );



    const getDaysJoined = (date) => {
        const joindDate = new Date(date)
        const nowDate = new Date()

        const differenceInTime = joindDate.getTime() - nowDate.getTime()
        const differenceInDay = (-differenceInTime / (1000 * 3600 * 24))
        return differenceInDay.toFixed(0)
    }

    return (
        currentUser ? <>
            <StatusBar style='light'></StatusBar>
            <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
                <SafeAreaView
                    style={styles.container}
                >
                    <ScrollView style={{ marginBottom: Platform.OS == 'android' ? 70 : 0 }}>

                        <View style={{ width: "100%" }}>
                            <Image
                                source={{ uri: currentUser?.avatar }}
                                resizeMode="cover"
                                style={{
                                    height: 228,
                                    width: "100%",
                                }}
                            />
                        </View>

                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Image
                                source={{ uri: currentUser?.avatar }}
                                resizeMode="contain"
                                style={{
                                    height: 155,
                                    width: 155,
                                    borderRadius: 999,
                                    borderColor: COLORS.primary,
                                    borderWidth: 2,
                                    marginTop: -90,
                                }}
                            />

                            <Text
                                style={{
                                    ...FONTS.h3,
                                    color: COLORS.white,
                                    marginVertical: 8,
                                }}
                            >
                                {currentUser.userName}
                            </Text>


                            <View
                                style={{
                                    flexDirection: "row",
                                    marginVertical: 6,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        ...FONTS.body4,
                                    }}
                                >
                                    {currentUser.role.toUpperCase()}
                                </Text>
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        ...FONTS.body4,
                                        marginHorizontal: 10
                                    }}
                                >
                                    ||
                                </Text>
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        marginLeft: 4,
                                        color: COLORS.white
                                    }}
                                >
                                    {currentUser.country}
                                </Text>
                            </View>

                            <View
                                style={{
                                    paddingVertical: 8,
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        marginHorizontal: SIZES.padding,
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.h2,
                                            color: COLORS.white,
                                        }}
                                    >
                                        {currentUser.songs.length}
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            color: COLORS.white,
                                        }}
                                    >
                                        Songs
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        marginHorizontal: SIZES.padding,
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.h2,
                                            color: COLORS.white,
                                        }}
                                    >
                                        {currentUser.playlists.length}
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            color: COLORS.white,
                                        }}
                                    >
                                        Playlists
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        marginHorizontal: SIZES.padding,
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.h2,
                                            color: COLORS.white,
                                        }}
                                    >
                                        {getDaysJoined(currentUser.createdAt)}
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            color: COLORS.white,
                                        }}
                                    >
                                        Days Joined
                                    </Text>
                                </View>
                            </View>
                        </View>

                            <TabView
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={setIndex}
                                initialLayout={{ width: layout.width, height: layout.height }}
                                renderTabBar={renderTabBar}
                            style={{ flex: 1, marginHorizontal: 10, height: Math.ceil(userSongs.length / 2) * 71 + 44 }}
                        />
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient >
        </> : <>
            <StatusBar style='light'></StatusBar>
            <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
                <SafeAreaView
                    style={styles.container}
                >
                    <ScrollView style={{ marginBottom: Platform.OS == 'android' ? 70 : 0 }}>
                        <Header></Header>

                        <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: "500",
                                color: "white",
                                marginTop: 10,
                                textAlign: 'center',
                                textAlignVertical: "center",
                            }}>
                                Please login to view this page
                            </Text>
                    </View>
                        </ScrollView>
                </SafeAreaView>
            </LinearGradient >
        </>
    );
};


export default Profilecreen;


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
    userSongsItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
    },
    userSongsItemPressed: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: MD3Colors.error50,
        borderRadius: 4,
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