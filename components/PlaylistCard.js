import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { MD3Colors } from "react-native-paper";

const PlaylistCard = ({ item }) => {
    return (
        <Pressable style={({ pressed }) => pressed ? styles.playlistBadgePressed : styles.playlistBadge}>
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
    );
};

export default PlaylistCard;

const styles = StyleSheet.create({
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
});
