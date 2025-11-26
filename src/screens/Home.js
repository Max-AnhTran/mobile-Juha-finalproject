// 1. Library
import {useState, useEffect} from "react";
import {View, Text, Image, Pressable, Dimensions, ScrollView, ActivityIndicator} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {getLatLngFromAddress} from "../api/geocoding";
import {searchActivities} from "../api/amadeus";

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

const {width: SCREEN_WIDTH} = Dimensions.get("window");

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

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            updateList();
        });

        return unsubscribe;
    }, [navigation]);

    const updateList = async () => {
        try {
            const list = await getAllActivities();
            console.log(list);
            setSavedActivities(list);
        } catch (error) {
            console.error("Could not get items", error);
        }
    };

    const handleSearch = async (inputAddressToGetResults) => {
        try {
            setLoading(true);
            setAddress(inputAddressToGetResults);
            setSearchedAddress(inputAddressToGetResults);

            // 1. Get latitude & longitude from the address
            const {latitude, longitude} = await getLatLngFromAddress(inputAddressToGetResults);

            // 2. Call Amadeus API to search for activities
            const activities = await searchActivities(latitude, longitude);

            // 3. Update state with the results and theme
            setResults(activities);
            setTheme({
                backgroundColors: ["#EFF2FF", "#EFF2FF"],
                tagBackgroundColor: "#E4E7FF",
                fontColor: "#2A2929",
            });
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // const handleSearch = async (inputAddressToGetResults) => {
    //     try {
    //         setLoading(true);
    //         setSearchedAddress(inputAddressToGetResults);
    //         // const {latitude, longitude} = await getLatLngFromAddress(inputAddressToGetResults);
    //         await delay(100);
    //         setResults(activitiesMock.data);
    //         setTheme({
    //             backgroundColors: ["#EFF2FF", "#EFF2FF"],
    //             tagBackgroundColor: "#E4E7FF",
    //             fontColor: "#2A2929",
    //         });
    //         setLoading(false);
    //     } catch (err) {
    //         console.error("Fetch error:", err);
    //     }
    // };

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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreaZone}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={theme.backgroundColors}
                    style={styles.background}
                />
                <Pressable
                    style={{
                        display: active ? "flex" : "none",
                        position: "absolute",
                        inset: 0,
                        zIndex: 98,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                    onPress={() => setActive(false)}
                ></Pressable>

                <SavedActivitiesModal
                    active={active}
                    savedActivities={savedActivities}
                    navigation={navigation}
                    deleteActivity={deleteActivity}
                    updateList={updateList}
                />

                <ScrollView overScrollMode="never" bounces={false} style={styles.container}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Pressable onPress={handleHome}>
                            <MaterialCommunityIcons
                                name="home-circle"
                                size={30}
                                color={theme.fontColor}
                                style={{padding: 10, marginLeft: -10}}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                updateList();
                                setActive(true);
                            }}
                        >
                            <Octicons
                                name="feed-heart"
                                size={24}
                                color={theme.fontColor}
                                style={{padding: 10, marginRight: -10}}
                            />
                        </Pressable>
                    </View>
                    <Text style={{fontFamily: "Roboto_500Medium", fontSize: 42, color: theme.fontColor, marginTop: 30}}>
                        Discover Your {"\n"}
                        Next Adventure
                    </Text>
                    <SearchBar
                        address={address}
                        onAddressChange={setAddress}
                        onSearch={(addr) => {
                            handleSearch(addr);
                            setChosenTag(addr);
                        }}
                    />
                    <Text style={{fontFamily: "Roboto_500Medium", fontSize: 26, color: theme.fontColor, marginTop: 35}}>
                        Popular Tags
                    </Text>
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
                                                <Pressable
                                                    key={`${rowIndex}-${i}`}
                                                    onPress={() => {
                                                        handleSearch(tag);
                                                        setChosenTag(tag);
                                                        setTags([tag, ...tags.filter((tagItem) => tagItem !== tag)]);
                                                    }}
                                                    style={[
                                                        {
                                                            backgroundColor: theme.tagBackgroundColor,
                                                            borderRadius: 16,
                                                            marginRight: 10,
                                                            paddingHorizontal: 18,
                                                            paddingVertical: 10,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: "Roboto_500Medium",
                                                            fontSize: 16,
                                                            textAlign: "center",
                                                            color: "#000",
                                                        }}
                                                    >
                                                        {tag}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        {results && (
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                {tags.map((tag, i) => (
                                    <Pressable
                                        key={`${i}`}
                                        onPress={() => {
                                            handleSearch(tag);
                                            setChosenTag(tag);
                                        }}
                                        style={[
                                            {
                                                backgroundColor:
                                                    chosenTag === tag ? "#8497FE" : theme.tagBackgroundColor,
                                                borderRadius: 16,
                                                marginRight: 10,
                                                paddingHorizontal: 18,
                                                paddingVertical: 10,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Roboto_500Medium",
                                                fontSize: 16,
                                                textAlign: "center",
                                                color: chosenTag === tag ? "#fff" : "#000",
                                            }}
                                        >
                                            {tag}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {results && (
                        <View style={{marginTop: 10, flex: 1}}>
                            <Image
                                source={flags}
                                style={{marginLeft: -30, width: SCREEN_WIDTH, resizeMode: "contain"}}
                            />
                            <Text
                                style={{
                                    fontFamily: "Roboto_500Medium",
                                    fontSize: 26,
                                    color: theme.fontColor,
                                }}
                            >
                                Results
                            </Text>

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
                                        <ActivityCard
                                            key={i}
                                            result={result}
                                            navigation={navigation}
                                            searchedAddress={searchedAddress}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Background image */}
                {!results && (
                    <View
                        style={{
                            shadowColor: "#fff",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.6,
                            shadowRadius: 15,
                            elevation: 5,
                            borderRadius: 10,
                        }}
                    >
                        <Image source={earth} style={styles.earth} />
                    </View>
                )}

                {/* Loading */}
                {loading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#EFF2FF" />
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
