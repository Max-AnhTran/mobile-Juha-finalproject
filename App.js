import {useEffect, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import {View, Image, Text, StyleSheet, ActivityIndicator} from "react-native";
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
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import ForgotPassword from "./src/screens/ForgotPassword";
import {initializeDb} from "./src/services/dbService";
import {AuthProvider, useAuth} from "./src/context/AuthContext";

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

function AppNavigator() {
    const {user, loading: authLoading} = useAuth();
    const [showRealApp, setShowRealApp] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

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
        if ((loaded || error) && dbReady && !authLoading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error, dbReady, authLoading]);

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
        setShowIntro(false);
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

    // Show loading indicator while checking auth state
    if ((!loaded && !error) || !dbReady || authLoading) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color="#8898FC" />
            </View>
        );
    }

    // Show intro slides only for first-time users
    if (showIntro && !user) {
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
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {user ? (
                    // User is signed in
                    <>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Activity" component={Activity} />
                    </>
                ) : (
                    // User is not signed in
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
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
