// 1. Library
import {useState, useEffect} from "react";
import {View, Image, Dimensions, ScrollView} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {getLatLngFromAddress} from "../api/geocoding";
import {searchActivities} from "../api/amadeus";
import activitiesMock from "../data/activitiesMock";
import {useAudioPlayer} from "expo-audio";

import Animated, {
    FadeIn,
    FadeOut,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    SlideOutLeft,
    ZoomIn,
    ZoomOut,
    useAnimatedStyle,
    withTiming,
    withSpring,
    useSharedValue,
    withSequence,
    interpolate,
} from "react-native-reanimated";

const audioSource = require("../assets/sound.mp3");

// 2. File local
import styles from "../styles/commonStyles";
import {getAllActivities, deleteActivity} from "../services/dbService";
import SavedActivitiesModal from "../components/SavedActivitiesModal";
import ActivityCard from "../components/ActivityCard";
import SearchBar from "../components/SearchBar";
import popularTags from "../constants/popularTags";
import {distributeIntoRows} from "../utils/home";

// 3. Assets
import earth from "../assets/earth.png";
import flags from "../assets/flags.png";

// Import React Native Paper components
import {Text, Button, Chip, Surface, TouchableRipple, ActivityIndicator} from "react-native-paper";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(TouchableRipple);

export default function Home({navigation}) {
    const [active, setActive] = useState(false);

    const rowsData = distributeIntoRows(popularTags);

    const [tags, setTags] = useState(popularTags);
    const [chosenTag, setChosenTag] = useState("Paris");

    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState("");
    const [searchedAddress, setSearchedAddress] = useState("");

    const [savedActivities, setSavedActivities] = useState([]);

    const [theme, setTheme] = useState({
        tagBackgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundColors: ["#8898FC", "#DBBDE7"],
        fontColor: "#fff",
    });

    const [results, setResults] = useState(null);

    const player = useAudioPlayer(audioSource);

    const earthRotation = useSharedValue(0);
    const earthScale = useSharedValue(1);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            updateList();
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (!results) {
            earthRotation.value = withSequence(withTiming(360, {duration: 20000}), withTiming(0, {duration: 0}));
        }
    }, [results]);

    const updateList = async () => {
        try {
            const list = await getAllActivities();
            console.log(list);
            setSavedActivities(list);
        } catch (error) {
            console.error("Could not get items", error);
        }
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleSearch = async (inputAddressToGetResults) => {
        try {
            setLoading(true);
            setSearchedAddress(inputAddressToGetResults);
            await delay(100);
            setResults(activitiesMock.data);
            setTheme({
                backgroundColors: ["#EFF2FF", "#EFF2FF"],
                tagBackgroundColor: "#E4E7FF",
                fontColor: "#2A2929",
            });
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
            player.seekTo(0);
            player.play();
        }
    };

    const handleHome = () => {
        setTheme({
            backgroundColors: ["#8898FC", "#DBBDE7"],
            tagBackgroundColor: "rgba(255, 255, 255, 0.8)",
            fontColor: "#fff",
        });
        setResults(null);
        setAddress("");
        setSearchedAddress("");
        setTags(popularTags);
        setChosenTag("");
    };

    const earthAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${earthRotation.value}deg`}, {scale: earthScale.value}],
        };
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreaZone}>
                <LinearGradient colors={theme.backgroundColors} style={styles.background} />

                {active && (
                    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
                        {/* Replaced Pressable with TouchableRipple for overlay */}
                        <TouchableRipple
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 98,
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                            }}
                            onPress={() => setActive(false)}
                            borderless={false}
                        />
                    </Animated.View>
                )}

                <SavedActivitiesModal
                    active={active}
                    savedActivities={savedActivities}
                    navigation={navigation}
                    deleteActivity={deleteActivity}
                    updateList={updateList}
                />

                <ScrollView overScrollMode="never" bounces={false} style={styles.container}>
                    <Animated.View
                        entering={FadeInDown.duration(400).springify()}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <AnimatedPressable onPress={handleHome} entering={FadeIn.delay(100)} borderless>
                            <MaterialCommunityIcons
                                name="home-circle"
                                size={30}
                                color={theme.fontColor}
                                style={{padding: 10, marginLeft: -10}}
                            />
                        </AnimatedPressable>
                        <AnimatedPressable
                            entering={FadeIn.delay(200)}
                            onPress={() => {
                                updateList();
                                setActive(true);
                            }}
                            borderless
                        >
                            <Octicons
                                name="feed-heart"
                                size={24}
                                color={theme.fontColor}
                                style={{padding: 10, marginRight: -10}}
                            />
                        </AnimatedPressable>
                    </Animated.View>

                    {/* Replaced with Paper Text component for better typography */}
                    <Animated.Text
                        entering={FadeInDown.delay(300).springify()}
                        style={{fontSize: 42, color: theme.fontColor, marginTop: 30}}
                        variant="displayMedium"
                    >
                        Discover Your {"\n"}
                        Next Adventure
                    </Animated.Text>

                    <Animated.View entering={FadeInDown.delay(400).springify()}>
                        <SearchBar
                            address={address}
                            onAddressChange={setAddress}
                            onSearch={(addr) => {
                                handleSearch(addr);
                                setChosenTag(addr);
                            }}
                        />
                    </Animated.View>

                    {/* Replaced with Paper Text component */}
                    <Animated.Text
                        entering={FadeInDown.delay(500).springify()}
                        style={{fontSize: 26, color: theme.fontColor, marginTop: 35}}
                        variant="headlineSmall"
                    >
                        Popular Tags
                    </Animated.Text>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={{
                            width: SCREEN_WIDTH,
                            maxHeight: results ? 50 : 160,
                            marginLeft: -30,
                            paddingLeft: 30,
                            marginTop: 15,
                        }}
                        contentContainerStyle={{alignItems: "center"}}
                    >
                        {!results && (
                            <View style={{flexDirection: "column", gap: 10}}>
                                {rowsData.map((rowItems, rowIndex) => {
                                    return (
                                        <View key={rowIndex} style={{flexDirection: "row", alignItems: "center"}}>
                                            {rowItems.map((tag, i) => (
                                                <AnimatedPressable
                                                    key={`${rowIndex}-${i}`}
                                                    entering={SlideInRight.delay(
                                                        (rowIndex * rowItems.length + i) * 50
                                                    ).springify()}
                                                    onPress={() => {
                                                        handleSearch(tag);
                                                        setChosenTag(tag);
                                                        setTags([tag, ...tags.filter((tagItem) => tagItem !== tag)]);
                                                    }}
                                                    style={[
                                                        {
                                                            borderRadius: 16,
                                                            marginRight: 10,
                                                        },
                                                    ]}
                                                    borderless
                                                >
                                                    {/* Replaced tag with Paper Chip component */}
                                                    <Chip
                                                        mode="flat"
                                                        style={{
                                                            backgroundColor: theme.tagBackgroundColor,
                                                        }}
                                                        textStyle={{
                                                            color: "#000",
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        {tag}
                                                    </Chip>
                                                </AnimatedPressable>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        {results && (
                            <Animated.View
                                entering={SlideInRight.springify()}
                                exiting={SlideOutLeft.springify()}
                                style={{flexDirection: "row", alignItems: "center"}}
                            >
                                {tags.map((tag, i) => (
                                    <AnimatedPressable
                                        key={`${i}`}
                                        entering={SlideInRight.delay(i * 50).springify()}
                                        onPress={() => {
                                            handleSearch(tag);
                                            setChosenTag(tag);
                                        }}
                                        style={[
                                            {
                                                borderRadius: 16,
                                                marginRight: 10,
                                            },
                                        ]}
                                        borderless
                                    >
                                        {/* Replaced tag with Paper Chip component */}
                                        <Chip
                                            mode="flat"
                                            style={{
                                                backgroundColor:
                                                    chosenTag === tag ? "#8497FE" : theme.tagBackgroundColor,
                                            }}
                                            textStyle={{
                                                color: chosenTag === tag ? "#fff" : "#000",
                                                fontSize: 16,
                                            }}
                                        >
                                            {tag}
                                        </Chip>
                                    </AnimatedPressable>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

                    {results && (
                        <Animated.View entering={FadeInUp.springify()} style={{marginTop: 10, flex: 1}}>
                            <Animated.Image
                                entering={SlideInRight.springify()}
                                source={flags}
                                style={{marginLeft: -30, width: SCREEN_WIDTH, resizeMode: "contain"}}
                            />
                            {/* Replaced with Paper Text component */}
                            <Animated.Text
                                entering={FadeInDown.delay(200).springify()}
                                style={{
                                    fontSize: 26,
                                    color: theme.fontColor,
                                }}
                                variant="headlineSmall"
                            >
                                Results
                            </Animated.Text>

                            <View style={{flex: 1}}>
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    style={{
                                        minHeight: 200,
                                        flexDirection: "row",
                                        width: SCREEN_WIDTH,
                                        marginLeft: -30,
                                        paddingLeft: 30,
                                    }}
                                    contentContainerStyle={{alignItems: "center"}}
                                >
                                    {results.map((result, i) => (
                                        <Animated.View key={i} entering={SlideInRight.delay(i * 100).springify()}>
                                            <ActivityCard
                                                result={result}
                                                navigation={navigation}
                                                searchedAddress={searchedAddress}
                                            />
                                        </Animated.View>
                                    ))}
                                </ScrollView>
                            </View>
                        </Animated.View>
                    )}
                </ScrollView>

                {/* Background image */}
                {!results && (
                    <Animated.View
                        entering={ZoomIn.duration(800).springify()}
                        exiting={ZoomOut.duration(400)}
                        style={{
                            shadowColor: "#fff",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.6,
                            shadowRadius: 15,
                            elevation: 5,
                            borderRadius: 10,
                        }}
                    >
                        <Animated.Image source={earth} style={[styles.earth, earthAnimatedStyle]} />
                    </Animated.View>
                )}

                {/* Loading - Replaced ActivityIndicator with Paper's ActivityIndicator */}
                {loading && (
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.loading}
                    >
                        <ActivityIndicator size="large" color="#EFF2FF" animating={true} />
                    </Animated.View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
