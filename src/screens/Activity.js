import {View, ScrollView, Dimensions, Image, Linking} from "react-native";
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
import Swiper from "react-native-swiper";

import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInLeft,
    SlideInRight,
    ZoomIn,
    BounceIn,
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue,
    withSequence,
    withRepeat,
} from "react-native-reanimated";

// Import React Native Paper components
import {Button, Chip, Surface, TouchableRipple} from "react-native-paper";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

// Create Animated versions with Paper components
const AnimatedPressable = Animated.createAnimatedComponent(TouchableRipple);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableRipple);

export default function Activity({route, navigation}) {
    const {activity} = route.params;

    const [active, setActive] = useState(false);
    const [zoomOut, setZoomOut] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const scrollRef = useRef();

    const html = activity.description;
    const plainText = htmlToText(html, {
        wordwrap: 130,
    });

    // Shared values for animations
    const heartScale = useSharedValue(1);
    const playButtonScale = useSharedValue(1);
    const imageScale = useSharedValue(0.8);
    const decorationRotation = useSharedValue(0);

    useEffect(() => {
        // Animate image entrance
        imageScale.value = withSpring(1, {damping: 10});

        // Rotate decoration continuously
        decorationRotation.value = withRepeat(withTiming(360, {duration: 20000}), -1, false);
    }, []);

    // Animate heart when toggled
    useEffect(() => {
        if (active) {
            heartScale.value = withSequence(withSpring(1.3, {damping: 5}), withSpring(1, {damping: 10}));
        }
    }, [active]);

    // Animate play button when speaking
    useEffect(() => {
        if (isSpeaking) {
            playButtonScale.value = withRepeat(
                withSequence(withTiming(1.05, {duration: 500}), withTiming(1, {duration: 500})),
                -1,
                true
            );
        } else {
            playButtonScale.value = withSpring(1);
        }
    }, [isSpeaking]);

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

    // Animated styles
    const heartAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: heartScale.value}],
    }));

    const playButtonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: playButtonScale.value}],
    }));

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: imageScale.value}],
    }));

    const decorationAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${decorationRotation.value}deg`}],
    }));

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{...styles.safeAreaZone, backgroundColor: "#EFF2FF"}}>
                <ScrollView ref={scrollRef} overScrollMode="never" bounces={false} style={styles.container}>
                    <Animated.View
                        entering={FadeInDown.duration(300).springify()}
                        style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}
                    >
                        <AnimatedPressable
                            entering={SlideInLeft.springify()}
                            onPress={() => navigation.goBack()}
                            borderless
                        >
                            <Octicons
                                name="chevron-left"
                                size={24}
                                color="black"
                                style={{paddingVertical: 10, paddingRight: 10}}
                            />
                        </AnimatedPressable>
                        <AnimatedPressable
                            entering={SlideInRight.springify()}
                            onPress={saveAndDelete}
                            style={heartAnimatedStyle}
                            borderless
                        >
                            <Octicons
                                name={active ? "heart-fill" : "heart"}
                                size={24}
                                color={active ? "red" : "black"}
                                style={{paddingVertical: 10, paddingLeft: 10}}
                            />
                        </AnimatedPressable>
                    </Animated.View>

                    <Animated.View
                        entering={ZoomIn.duration(600).springify()}
                        style={{position: "relative", alignItems: "center"}}
                    >
                        <Animated.Image
                            source={{uri: activity.pictures[0]}}
                            style={[
                                {width: SCREEN_WIDTH - 120, height: SCREEN_WIDTH - 120, borderRadius: 999},
                                imageAnimatedStyle,
                            ]}
                        />
                        <Animated.Image
                            source={img_deco2}
                            style={[
                                {
                                    width: SCREEN_WIDTH - 80,
                                    height: SCREEN_WIDTH - 80,
                                    position: "absolute",
                                    top: -20,
                                    left: SCREEN_WIDTH / 2 - 30 - (SCREEN_WIDTH - 80) / 2,
                                },
                                decorationAnimatedStyle,
                            ]}
                        />
                    </Animated.View>

                    {/* Replaced with Paper Text component */}
                    <Animated.Text
                        entering={FadeInUp.delay(400).springify()}
                        style={{fontSize: 32, marginTop: 20, textAlign: "center"}}
                        variant="headlineMedium"
                    >
                        {activity.name}
                    </Animated.Text>

                    <Animated.View
                        entering={FadeInUp.delay(500).springify()}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 20,
                        }}
                    >
                        {/* Replaced price display with Paper Chip */}
                        <Animated.View entering={SlideInLeft.delay(600).springify()}>
                            <Chip
                                mode="flat"
                                style={{
                                    backgroundColor: "#8497FE",
                                    marginRight: 10,
                                }}
                                textStyle={{color: "#fff", fontWeight: "bold"}}
                            >
                                € {activity.price.amount}
                            </Chip>
                        </Animated.View>

                        {/* Replaced rating display with Paper Chip */}
                        <Animated.View entering={SlideInRight.delay(600).springify()}>
                            <Chip
                                mode="flat"
                                style={{
                                    backgroundColor: "#8497FE",
                                    marginRight: 10,
                                }}
                                icon={() => <Octicons name="star-fill" size={16} color="yellow" />}
                                textStyle={{color: "#fff", fontWeight: "bold"}}
                            >
                                {activity.rating}
                            </Chip>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View
                        entering={BounceIn.delay(700)}
                        style={{
                            marginTop: 20,
                            alignItems: "center",
                        }}
                    >
                        {/* Replaced play button with Paper Button */}
                        <Animated.View style={playButtonAnimatedStyle}>
                            <Button
                                mode="contained"
                                onPress={speak}
                                icon={() => <Ionicons name={isSpeaking ? "stop" : "play"} size={22} color="#fff" />}
                                style={{
                                    backgroundColor: isSpeaking ? "#E74C3C" : "#4A90E2",
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                }}
                                contentStyle={{flexDirection: "row-reverse"}}
                                labelStyle={{color: "#fff", fontSize: 18, fontWeight: "600"}}
                            >
                                {isSpeaking ? "Stop" : "Play"}
                            </Button>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(800).springify()} style={{marginTop: 20}}>
                        <RenderHtml
                            tagsStyles={{p: {color: "#707070", fontSize: 16, fontWeight: "bold"}}}
                            contentWidth={"100%"}
                            source={{html: activity.description.replace(/\n/g, "<br />")}}
                        />
                    </Animated.View>

                    {/* Replaced booking link with Paper Button in text mode */}
                    <Animated.View entering={FadeIn.delay(900)} style={{marginTop: 12}}>
                        <Button
                            mode="text"
                            onPress={() => Linking.openURL(activity.bookingLink)}
                            textColor="#8497FE"
                            style={{paddingVertical: 5}}
                            labelStyle={{fontSize: 16, textDecorationLine: "underline"}}
                        >
                            Click to book this activity
                        </Button>
                    </Animated.View>

                    <Animated.View entering={FadeIn.delay(900)} style={{marginTop: 12, height: 250}}>
                        <Swiper showsPagination autoplay>
                            {activity.pictures.map((img, index) => (
                                <Image key={index} source={{uri: img}} style={{width: "100%", height: 250}} />
                            ))}
                        </Swiper>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(1000).springify()}>
                        <Surface style={{borderRadius: 20, overflow: "hidden", marginTop: 20}}>
                            <MapView
                                style={{
                                    width: SCREEN_WIDTH - 60,
                                    height: zoomOut ? SCREEN_HEIGHT * 0.8 : SCREEN_WIDTH - 60,
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
                                <AnimatedPressable
                                    entering={ZoomIn.delay(1200)}
                                    onPress={() => setZoomOut(!zoomOut)}
                                    borderless
                                >
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
                                </AnimatedPressable>
                            </MapView>
                        </Surface>
                    </Animated.View>

                    {/* Replaced favorite button with Paper Button */}
                    <Animated.View entering={BounceIn.delay(1100)} style={{marginTop: 15}}>
                        <Button
                            mode="contained"
                            onPress={saveAndDelete}
                            style={{
                                backgroundColor: active ? "red" : "#8497FE",
                                borderRadius: 20,
                                paddingVertical: 10,
                            }}
                            labelStyle={{fontSize: 16, fontWeight: "bold"}}
                        >
                            {active ? "Remove from Favorites" : "+ Add to Favorites"}
                        </Button>
                    </Animated.View>

                    <View style={{height: 10}}></View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
