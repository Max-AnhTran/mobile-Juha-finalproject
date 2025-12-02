import {useEffect, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import {View, Image, Text, StyleSheet} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import {
    useFonts,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_400Regular_Italic,
} from "@expo-google-fonts/roboto";

import Home from "./src/screens/Home";
import Activity from "./src/screens/Activity";
import {initializeDb} from "./src/services/dbService";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const slides = [
    {
        key: "one",
        title: "Welcome to TravelApp",
        text: "Discover interesting destinations and unique travel activities",
        image: require("./src/assets/earth.png"),
        backgroundColor: "#59b2ab",
    },
    {
        key: "two",
        title: "Easy Search",
        text: "Search for travel activities by location and your interests",
        image: require("./src/assets/earth.png"),
        backgroundColor: "#febe29",
    },
    {
        key: "three",
        title: "Save Your Favorites",
        text: "Save your favorite activities to view later",
        image: require("./src/assets/earth.png"),
        backgroundColor: "#22bcb5",
    },
];

export default function App() {
    const [showRealApp, setShowRealApp] = useState(false);

    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
    });

    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        initializeDb().then((result) => {
            setDbReady(result);
        });
    }, []);

    useEffect(() => {
        if ((loaded || error) && dbReady) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error, dbReady]);

    const _renderItem = ({item}) => {
        return (
            <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
                <Text style={styles.title}>{item.title}</Text>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    };

    const _onDone = () => {
        setShowRealApp(true);
    };

    const _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Text style={styles.buttonText}>Next</Text>
            </View>
        );
    };

    const _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Text style={styles.buttonText}>Get Started</Text>
            </View>
        );
    };

    if ((!loaded && !error) || !dbReady) {
        return null;
    }

    if (!showRealApp) {
        return (
            <AppIntroSlider
                renderItem={_renderItem}
                data={slides}
                onDone={_onDone}
                renderNextButton={_renderNextButton}
                renderDoneButton={_renderDoneButton}
                showSkipButton={true}
                onSkip={_onDone}
                bottomButton
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}
            />
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                <Stack.Screen name="Activity" component={Activity} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 96,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginTop: 50,
        marginHorizontal: 20,
        fontFamily: "Roboto_700Bold",
    },
    image: {
        width: 300,
        height: 300,
        marginVertical: 32,
        resizeMode: "contain",
    },
    text: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
        marginHorizontal: 30,
        fontFamily: "Roboto_400Regular",
    },
    buttonCircle: {
        width: 80,
        height: 40,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    dotStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    activeDotStyle: {
        backgroundColor: "white",
        width: 20,
    },
});
