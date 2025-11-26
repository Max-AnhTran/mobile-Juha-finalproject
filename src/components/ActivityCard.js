import React from "react";
import {View, Text, Image, Pressable} from "react-native";

export default function ActivityCard({result, navigation, searchedAddress}) {
    return (
        <View
            key={result.id || result.name}
            style={{
                flexDirection: "column",
                alignItems: "center",
                height: "90%",
                backgroundColor: "#fff",
                borderRadius: 30,
                marginRight: 24,
                padding: 24,
                paddingBottom: 58,
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 4,
            }}
        >
            <View style={{position: "relative", padding: 20}}>
                <Image source={{uri: result.pictures[0]}} style={{width: 100, height: 100, borderRadius: 50}} />
                <Image
                    source={require("../assets/img-deco.png")}
                    style={{
                        width: 140,
                        height: 140,
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                />
            </View>
            <View
                style={{
                    marginTop: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    height: 55,
                }}
            >
                <Text
                    style={{
                        width: 200,
                        fontFamily: "Roboto_500Medium",
                        fontSize: 14,
                        textAlign: "center",
                        color: "#000",
                    }}
                >
                    {result.name}
                </Text>
            </View>
            <Pressable
                onPress={() =>
                    navigation.navigate("Activity", {
                        activity: {...result, location: searchedAddress, rating: "5.0"},
                    })
                }
                style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#8497FE",
                    borderRadius: 6,
                    marginTop: 5,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Roboto_500Medium",
                        fontSize: 16,
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    See More Details
                </Text>
            </Pressable>
        </View>
    );
}
