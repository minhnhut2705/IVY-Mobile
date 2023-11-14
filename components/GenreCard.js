import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { MD3Colors } from "react-native-paper";

const GenreCard = ({ item }) => {
    return (
        <Pressable style={({ pressed }) => pressed ? styles.genreBadgePressed : styles.genreBadge}>
            <Text style={{ color: 'white' }}
            >
                {item?.name}
            </Text>
        </Pressable>
    );
};

export default GenreCard;

const styles = StyleSheet.create({
    genreBadge: {
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
    genreBadgePressed: {
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
