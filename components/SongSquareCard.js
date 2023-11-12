import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";

const SongSquareCard = ({ item, onPress }) => {
    return (
        <Pressable style={{ margin: 10 }} onPress={onPress}>
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
    );
};

export default SongSquareCard;

const styles = StyleSheet.create({});
