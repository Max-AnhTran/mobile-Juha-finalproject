import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_400Regular_Italic,
    useFonts,
} from "@expo-google-fonts/roboto";

import Home from "./screens/Home";
import Activity from "./screens/Activity";
import {initializeDb} from "./services/dbService";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
    // Load fonts
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
    });

    // SQLite
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

    if ((!loaded && !error) || !dbReady) {
        return null; // keep showing the splash screen till font and db is ready
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
