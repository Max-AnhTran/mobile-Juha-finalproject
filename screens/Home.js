import {useState, useEffect, use} from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    FlatList,
} from "react-native";
import {Input, Button} from "@rneui/themed";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import styles from "../styles";
import {LinearGradient} from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import activitiesMock from "../data/activitiesMock";

import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts,
} from "@expo-google-fonts/roboto";
import earth from "../assets/earth.png";
import flags from "../assets/flags.png";
import img_deco from "../assets/img-deco.png";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

const popularTags = [
    "Paris",
    "New York",
    "Tokyo",
    "Sydney",
    "Rome",
    "Barcelona",
    "London",
    "Dubai",
    "Singapore",
    "Istanbul",
    "Bangkok",
    "Hong Kong",
    "Los Angeles",
    "San Francisco",
    "Miami",
    "Amsterdam",
    "Vienna",
    "Prague",
    "Budapest",
    "Cairo",
];
const rows = 3;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const {height: SCREEN_HEIGHT} = Dimensions.get("window");

function distributeIntoRows(items, rows = 3) {
    const result = Array.from({length: rows}, () => []);
    items.forEach((item, i) => {
        result[i % rows].push(item); // round-robin
    });
    return result;
}

const accessToken = "";
const apiKey = "";

export default function Home({navigation}) {
    const [active, setActive] = useState(false);

    const rowsData = distributeIntoRows(popularTags, rows);

    const [tags, setTags] = useState(popularTags);
    const [chosenTag, setChosenTag] = useState("Paris");

    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState("");
    const [searchedAddress, setSearchedAddress] = useState("");

    const [theme, setTheme] = useState({
        tagBackgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundColors: ["#8898FC", "#DBBDE7"],
        fontColor: "#fff",
    });

    const [results, setResults] = useState(null);

    // Load fonts
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
    });

    // SQLite
    const [dbReady, setDbReady] = useState(false);
    const db = SQLite.openDatabaseSync("address.db");

    const initializeDb = async () => {
        try {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS address (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT);`
            );
            setDbReady(true);
        } catch (error) {
            console.error("Db init error: ", error);
        }
    };

    useEffect(() => {
        initializeDb();
    }, []);

    // Hide splash screen when everything is ready
    useEffect(() => {
        if ((loaded || error) && dbReady) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error, dbReady, theme, loading, results]);

    if ((!loaded && !error) || !dbReady) {
        return null; // keep showing the splash screen till font and db is ready
    }

    // const [address, setAddress] = useState("");
    // const [addresses, setAddresses] = useState([]);

    // const [region, setRegion] = useState({
    //     latitude: 60.200692,
    //     longitude: 24.934302,
    //     latitudeDelta: 0.0322,
    //     longitudeDelta: 0.0221,
    // });

    // const saveAddress = async () => {
    //     try {
    //         if (!address) return;
    //         await db.runAsync("INSERT INTO address (address) VALUES (?);", address);
    //         setAddress("");
    //         await updateList();
    //     } catch (error) {
    //         console.error("Could not add item", error);
    //     }
    // };

    // const deleteAddress = async (id) => {
    //     try {
    //         await db.runAsync("DELETE FROM address WHERE id=?", id);
    //         await updateList();
    //     } catch (error) {
    //         console.error("Could not delete item", error);
    //     }
    // };

    // const updateList = async () => {
    //     try {
    //         const list = await db.getAllAsync("SELECT * from address;");
    //         setAddresses(list);
    //     } catch (error) {
    //         console.error("Could not get items", error);
    //     }
    // };

    const getLatLngFromAddress = async (inputAddressToGetLatLng) => {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                inputAddressToGetLatLng
            )}&key=${apiKey}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        const location = data.results[0].geometry.location;
        const returnData = {
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lng),
        };
        return returnData;
    };

    // const handleSearch = async (inputAddressToGetResults) => {
    //     try {
    //         setLoading(true);
    //         setAddress(inputAddressToGetResults);
    //         // const {latitude, longitude} = await getLatLngFromAddress(inputAddressToGetResults);
    //         const {latitude, longitude} = {latitude: 60.200692, longitude: 24.934302};
    //         const res = await fetch(
    //             `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=1`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                     Accept: "application/json",
    //                 },
    //             }
    //         );
    //         if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    //         const data = await res.json();
    //         setResults(data.data);
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

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleSearch = async (inputAddressToGetResults) => {
        try {
            setLoading(true);
            setSearchedAddress(inputAddressToGetResults);
            // const {latitude, longitude} = await getLatLngFromAddress(inputAddressToGetResults);
            await delay(1000);
            setResults(activitiesMock.data);
            setTheme({
                backgroundColors: ["#EFF2FF", "#EFF2FF"],
                tagBackgroundColor: "#E4E7FF",
                fontColor: "#2A2929",
            });
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
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
                        {activitiesMock.data.map((item) => (
                            <Pressable
                                key={item.id}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "rgba(0, 0, 0, 0.1)",
                                }}
                                onPress={() => console.log(item.name)}
                            >
                                <View style={{paddingTop: 10, paddingBottom: 8}}>
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
                                <Pressable onPress={() => console.log(item.name)}>
                                    <Ionicons
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
                <ScrollView overScrollMode="never" bounces={false} style={styles.container}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <Pressable onPress={handleHome}>
                            <Ionicons
                                name="home"
                                size={24}
                                color={theme.fontColor}
                                style={{paddingVertical: 10, paddingRight: 10}}
                            />
                        </Pressable>
                        <Pressable style={{position: "relative", zIndex: 99}} onPress={() => setActive(!active)}>
                            <Ionicons
                                name="heart"
                                size={24}
                                color={theme.fontColor}
                                style={{paddingVertical: 10, paddingLeft: 10}}
                            />
                        </Pressable>
                    </View>
                    <Text style={{fontFamily: "Roboto_500Medium", fontSize: 42, color: theme.fontColor, marginTop: 40}}>
                        Discover Your {"\n"}
                        Next Adventure
                    </Text>
                    <View style={{flexDirection: "row", width: "100%", marginTop: 20}}>
                        <TextInput
                            placeholder="Search destination"
                            placeholderTextColor={"#CCCBCB"}
                            style={{
                                flex: 1,
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                borderRadius: 10,
                                backgroundColor: "#fff",
                                fontFamily: "Roboto_400Regular",
                                fontSize: 16,
                            }}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                        />
                        <Pressable
                            onPress={() => handleSearch(address)}
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                marginLeft: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 20,
                            }}
                        >
                            <Ionicons name="search" size={20} color="#CCCBCB" />
                        </Pressable>
                    </View>
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
                                        <View
                                            key={`${i}`}
                                            onPress={() => console.log("Result", result)}
                                            style={[
                                                {
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    height: "90%",
                                                    backgroundColor: "#fff",
                                                    borderRadius: 30,
                                                    marginRight: 24,
                                                    padding: 24,
                                                    paddingBottom: 58,
                                                    boxShadow: "0px 0px 15px 2px rgba(0, 0, 0, 0.1)",
                                                },
                                            ]}
                                        >
                                            <View style={{position: "relative", padding: 20}}>
                                                <Image
                                                    source={{uri: result.pictures[0]}}
                                                    style={{width: 100, height: 100, borderRadius: 50}}
                                                />
                                                <Image
                                                    source={img_deco}
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
                                                    navigation.navigate("Activity", {geoCode: result.geoCode})
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
