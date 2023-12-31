import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const RecentlyPlayedCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() =>
                navigation.navigate("Info", {
                    item: item,
                })
            }
            style={{ margin: 10 }}
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
    );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({});
