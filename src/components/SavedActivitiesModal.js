// components/SavedActivitiesModal.js
import {View, Text, ScrollView, Pressable, Dimensions} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const {height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function SavedActivitiesModal({active, savedActivities, navigation, deleteActivity, updateList}) {
    if (!active) return null;

    return (
        <View
            style={{
                position: "absolute",
                top: 100,
                right: 30,
                zIndex: 99,
                display: active ? "flex" : "none",
                backgroundColor: "white",
                width: SCREEN_WIDTH - 60,
                maxHeight: SCREEN_HEIGHT / 1.5,
                padding: 20,
                borderRadius: 20,
            }}
        >
            <Text
                style={{
                    fontFamily: "Roboto_700Bold",
                    fontSize: 18,
                    color: "#000",
                    marginBottom: 10,
                    backgroundColor: "#EFF2FF",
                    padding: 10,
                    borderRadius: 10,
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                }}
            >
                ❤️ SAVED ACTIVITIES
            </Text>
            <ScrollView contentContainerStyle={{flexDirection: "column"}}>
                {savedActivities.length === 0 && (
                    <Text
                        style={{
                            marginTop: 15,
                            fontFamily: "Roboto_400Regular_Italic",
                            fontSize: 14,
                            color: "#000",
                            textAlign: "center",
                        }}
                    >
                        No saved activities
                    </Text>
                )}
                {savedActivities.map((item) => (
                    <Pressable
                        key={item.id}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "rgba(0, 0, 0, 0.1)",
                        }}
                        onPress={() =>
                            navigation.navigate("Activity", {
                                activity: {
                                    id: item.id,
                                    name: item.name,
                                    description: item.description,
                                    geoCode: {
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    },
                                    pictures: [item.pictureLink],
                                    bookingLink: item.bookingLink,
                                    price: {
                                        currencyCode: "EUR",
                                        amount: item.price,
                                    },
                                    location: item.location,
                                    rating: "5.0",
                                },
                            })
                        }
                    >
                        <View style={{paddingTop: 10, paddingBottom: 8, maxWidth: "90%"}}>
                            <Text
                                style={{
                                    fontFamily: "Roboto_700Bold",
                                    fontSize: 18,
                                    color: "#000",
                                }}
                            >
                                {item.location}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 2,
                                    fontFamily: "Roboto_400Regular",
                                    fontSize: 14,
                                    color: "#000",
                                }}
                            >
                                {item.name}
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => {
                                deleteActivity(item.id);
                                updateList();
                            }}
                        >
                            <Octicons
                                name="trash"
                                size={24}
                                color="red"
                                style={{paddingVertical: 10, paddingLeft: 10}}
                            />
                        </Pressable>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
