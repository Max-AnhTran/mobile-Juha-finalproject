import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

// import Calculator from "./screens/Calculator";
// import History from "./screens/History";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen name="Calculator" component={Calculator} />
                <Stack.Screen name="History" component={History} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
