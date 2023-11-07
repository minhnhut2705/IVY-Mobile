import { StyleSheet, Image, Text, View, SafeAreaView, FlatList, StatusBar, Platform, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useNavigation } from '@react-navigation/native'
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import LionelMessi from '../assets/img/lionelMessi.jpg'
import { axiosInstance } from './LoginScreen';
import axios from 'axios';
import { baseUrl } from './LoginScreen';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard'
import ArtistCard from '../components/ArtistCard';

export default function HomeScreen() {
    const navigation = useNavigation()
    const [songs, setSongs] = React.useState([])
    const [artists, setArtists] = React.useState([])

    const handleAuthentication = async () => {
        navigation.navigate('Login')
    }

    const getAllSongs = async () => {
        try {
            const response = await axios.get(`${baseUrl}/songs`)
            setSongs(response.data.songs)
        } catch (error) {
            console.log(error);
        }
    }
    const getAllArtists = async () => {
        try {
            const response = await axios.get(`${baseUrl}/artists`)

            console.log('response artists', response.data.artists);
            setArtists(response.data.artists)
        } catch (error) {
            console.log(error);
        }
    }


    React.useEffect(() => {
        getAllSongs()
        getAllArtists()
    }, [])


    const renderSong = ({ item }) => {
        return (
            <Pressable
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    marginVertical: 8,
                    backgroundColor: "#282828",
                    borderRadius: 4,
                    elevation: 3,
                }}
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

    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 10 }}>
                    <Pressable onPress={() => handleAuthentication()} style={({ pressed }) => pressed ? styles.buttonPressed : styles.button}>
                        <Text style={styles.buttonText}>Login / Register</Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        marginHorizontal: 12,
                        marginVertical: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Pressable
                        style={{
                            backgroundColor: "#282828",
                            padding: 10,
                            borderRadius: 30,
                        }}
                    >
                        <Text style={{ fontSize: 15, color: "white" }}>Music</Text>
                    </Pressable>

                    <Pressable
                        style={{
                            backgroundColor: "#282828",
                            padding: 10,
                            borderRadius: 30,
                        }}
                    >
                        <Text style={{ fontSize: 15, color: "white" }}>
                            Podcasts & Shows
                        </Text>
                    </Pressable>
                </View>

                <View style={{ height: 10 }} />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Pressable
                        onPress={() => navigation.navigate("Liked")}
                        style={{
                            marginBottom: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                            marginHorizontal: 10,
                            marginVertical: 8,
                            backgroundColor: "#202020",
                            borderRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                            <Pressable
                                style={{
                                    width: 55,
                                    height: 55,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <AntDesign name="heart" size={24} color="white" />
                            </Pressable>
                        </LinearGradient>

                        <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
                            Liked Songs
                        </Text>
                    </Pressable>

                    <View
                        style={{
                            marginBottom: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                            marginHorizontal: 10,
                            marginVertical: 8,
                            backgroundColor: "#202020",
                            borderRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <View>
                            <Image
                                style={{ width: 55, height: 55 }}
                                source={{ uri: "https://via.placeholder.com/150/771796" }}
                            />
                        </View>
                        <View style={styles.randomArtist}>
                            <Text
                                style={{ color: "white", fontSize: 13, fontWeight: "bold" }}
                            >
                                Hiphop Tamhiza
                            </Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={songs.splice(0, 4)}
                    renderItem={renderSong}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />

                <Text
                    style={{
                        color: "white",
                        fontSize: 19,
                        fontWeight: "bold",
                        marginHorizontal: 10,
                        marginTop: 10,
                    }}
                >
                    Your Top Artists
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {artists.map((item, index) => (
                        <ArtistCard item={item} key={index} />
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
                <FlatList
                    data={songs.splice(0, 4)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <RecentlyPlayedCard item={item} key={index} />
                    )}
                />
            </ScrollView >
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
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
    }
})