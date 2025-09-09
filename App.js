import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import * as SQLite from "expo-sqlite";
import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts,
} from "@expo-google-fonts/roboto";

import Home from "./screens/Home";
import Activity from "./screens/Activity";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
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
