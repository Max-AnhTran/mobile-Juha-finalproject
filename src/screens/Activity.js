import {View, Text, Pressable, ScrollView, Dimensions, Image, Linking, TouchableOpacity} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import MapView, {Marker} from "react-native-maps";
import {useState, useRef, useEffect} from "react";
import Octicons from "@expo/vector-icons/Octicons";
import {Ionicons} from "@expo/vector-icons";
import styles from "../styles/commonStyles";
import img_deco2 from "../assets/img-deco2.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {saveActivity, deleteActivity, getActivityById} from "../services/dbService";
import RenderHtml from "react-native-render-html";
import {htmlToText} from "html-to-text";
import * as Speech from "expo-speech";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function Activity({route, navigation}) {
    const {activity} = route.params; // Get address from route params

    const [active, setActive] = useState(false);
    const [zoomOut, setZoomOut] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const scrollRef = useRef();

    const html = activity.description;

    const plainText = htmlToText(html, {
        wordwrap: 130,
    });

    const scrollToBottom = () => {
        scrollRef.current?.scrollToEnd({animated: true});
    };

    const speak = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        } else {
            Speech.speak(plainText, {
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
            });
            setIsSpeaking(true);
        }
    };

    useEffect(() => {
        const checkActivity = async () => {
            const result = await getActivityById(activity.id);
            if (result.length > 0) {
                setActive(true);
            }
        };
        console.log(activity);
        checkActivity();
    }, []);

    useEffect(() => {
        if (zoomOut) {
            scrollToBottom();
        }
    }, [zoomOut]);

    const saveAndDelete = () => {
        if (active) {
            deleteActivity(activity.id);
        } else {
            saveActivity(activity);
        }
        setActive(!active);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{...styles.safeAreaZone, backgroundColor: "#EFF2FF"}}>
                <ScrollView ref={scrollRef} overScrollMode="never" bounces={false} style={styles.container}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Octicons
                                name="chevron-left"
                                size={24}
                                color="black"
                                style={{paddingVertical: 10, paddingRight: 10}}
                            />
                        </Pressable>
                        <Pressable onPress={saveAndDelete}>
                            <Octicons
                                name={active ? "heart-fill" : "heart"}
                                size={24}
                                color={active ? "red" : "black"}
                                style={{paddingVertical: 10, paddingLeft: 10}}
                            />
                        </Pressable>
                    </View>

                    <View style={{position: "relative", alignItems: "center"}}>
                        <Image
                            source={{uri: activity.pictures[0]}}
                            style={{width: SCREEN_WIDTH - 120, height: SCREEN_WIDTH - 120, borderRadius: 999}}
                        />
                        <Image
                            source={img_deco2}
                            style={{
                                width: SCREEN_WIDTH - 80,
                                height: SCREEN_WIDTH - 80,
                                position: "absolute",
                                top: -20,
                                left: SCREEN_WIDTH / 2 - 30 - (SCREEN_WIDTH - 80) / 2,
                            }}
                        />
                    </View>
                    <Text style={{fontSize: 32, fontFamily: "Roboto_700Bold", marginTop: 20, textAlign: "center"}}>
                        {activity.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: "bold",
                                backgroundColor: "#8497FE",
                                borderRadius: 16,
                                marginRight: 10,
                                padding: 10,
                            }}
                        >
                            € {activity.price.amount}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#8497FE",
                                borderRadius: 16,
                                marginRight: 10,
                                padding: 10,
                            }}
                        >
                            <Text style={{color: "#fff", fontSize: 16, fontWeight: "bold"}}>{activity.rating} </Text>
                            <Octicons name="star-fill" size={16} color="yellow" />
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 20,
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 10,
                                    backgroundColor: "#4A90E2",
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    borderRadius: 12,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 5,
                                },
                                isSpeaking && {
                                    backgroundColor: "#E74C3C",
                                },
                            ]}
                            onPress={speak}
                        >
                            <Ionicons name={isSpeaking ? "stop" : "play"} size={22} color="#fff" />
                            <Text style={{color: "#fff", fontSize: 18, fontWeight: "600"}}>
                                {isSpeaking ? "Stop" : "Play"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 20}}>
                        <RenderHtml
                            tagsStyles={{p: {color: "#707070", fontSize: 16, fontWeight: "bold"}}}
                            contentWidth={"100%"}
                            source={{html: activity.description.replace(/\n/g, "<br />")}}
                        />
                    </View>

                    <Pressable onPress={() => Linking.openURL(activity.bookingLink)}>
                        <Text
                            style={{
                                color: "#8497FE",
                                fontSize: 16,
                                fontFamily: "Roboto_700Bold",
                                marginTop: 12,
                                textDecorationLine: "underline",
                                paddingVertical: 5,
                            }}
                        >
                            Click to book this activity
                        </Text>
                    </Pressable>

                    <MapView
                        style={{
                            position: "relative",
                            width: SCREEN_WIDTH - 60,
                            height: zoomOut ? SCREEN_HEIGHT * 0.8 : SCREEN_WIDTH - 60,
                            borderRadius: 20,
                            marginTop: 20,
                        }}
                        region={{
                            latitude: activity.geoCode.latitude,
                            longitude: activity.geoCode.longitude,
                            latitudeDelta: 0.0322,
                            longitudeDelta: 0.0221,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: activity.geoCode.latitude,
                                longitude: activity.geoCode.longitude,
                            }}
                        />
                        <Pressable onPress={() => setZoomOut(!zoomOut)}>
                            <MaterialIcons
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: "#fff",
                                    padding: 5,
                                    borderRadius: 999,
                                }}
                                name={zoomOut ? "zoom-in-map" : "zoom-out-map"}
                                size={24}
                                color="black"
                            />
                        </Pressable>
                    </MapView>

                    <Pressable onPress={saveAndDelete}>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                fontFamily: "Roboto_700Bold",
                                marginTop: 15,
                                paddingVertical: 20,
                                backgroundColor: active ? "red" : "#8497FE",
                                borderRadius: 20,
                                textAlign: "center",
                            }}
                        >
                            {active ? "Remove from Favorites" : "+ Add to Favorites"}
                        </Text>
                    </Pressable>

                    <View style={{height: 10}}></View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
