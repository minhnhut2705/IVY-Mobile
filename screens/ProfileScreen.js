import {
    View, Text, Image, StatusBar, Pressable, ScrollView, useWindowDimensions, FlatList, SafeAreaView, StyleSheet
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SIZES, images } from "../constants";
import { MaterialIcons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import AudioPlayer from '../components/Player';
import { currentUserAtom } from "../store";
import { useAtom } from "jotai";
import { MD3Colors } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient'


let photos = []
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




const Profilecreen = () => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [topSongs, setTopSongs] = React.useState([])
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

    const [routes] = useState([
        { key: "first", title: "Songs" },
        { key: "second", title: "Playlist" },
    ]);



    const PhotosRoutes = () => (
        <View style={{
            flex: 1,
            backgroundColor: "#040306",
            height: 350
        }}>
            <FlatList
                data={topSongs}
                renderItem={renderSong}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={{ flex: 1 }}
            />
        </View>

    );

    const LikesRoutes = () => (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                height: 350
            }}
        />
    );
    const renderScene = SceneMap({
        first: PhotosRoutes,
        second: LikesRoutes,
    });

    React.useEffect(() => {
        getTopSongs(12)
    }, [])

    const getTopSongs = async (numOfSong) => {
        try {
            const response = await axios.post(`${baseUrl}/songs`, { numOfSong: numOfSong })
            setTopSongs(response.data.songs)
            photos = response.data.songs.map(song => song.thumbnail)
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

    console.log('====================================');
    console.log(currentUser);
    console.log('====================================');

    const getDaysJoined = (date) => {
        const joindDate = new Date(date)
        const nowDate = new Date()

        const differenceInTime = joindDate.getTime() - nowDate.getTime()
        const differenceInDay = (-differenceInTime / (1000 * 3600 * 24))
        console.log('====================================');
        console.log(differenceInTime, differenceInDay,);
        console.log('====================================');
        return differenceInDay.toFixed(0)
    }

    return (
        <>
            <StatusBar style='light'></StatusBar>
            <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
                <SafeAreaView
                    style={styles.container}
                >
                    <View style={{ marginBottom: 70, height: '100%', justifyContent: 'flex-start' }}>

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

                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                            <TabView
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={setIndex}
                                initialLayout={{ width: layout.width, height: layout.height }}
                                renderTabBar={renderTabBar}
                            />
                        </View>
                    </View>
                    <AudioPlayer></AudioPlayer>
                </SafeAreaView>
            </LinearGradient >
        </>
    );
};

export default Profilecreen;


const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: Platform.OS === 'android' ? 50 : 0, justifyContent: 'flex-start' },
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