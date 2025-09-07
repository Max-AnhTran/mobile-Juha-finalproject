import {StyleSheet, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Button} from "@rneui/themed";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";

export default function Activity({route}) {
    const apiKey = "68b19790c8a2a153771537jswb4f34d";
    const {address} = route.params; // Get address from route params

    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    });

    const handleFetch = () => {
        fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`)
            .then((response) => {
                if (!response.ok) throw new Error("Error in fetch:" + response.statusText);

                return response.json();
            })
            .then((data) =>
                setRegion(
                    data.length
                        ? {
                              latitude: parseFloat(data[0].lat),
                              longitude: parseFloat(data[0].lon),
                              latitudeDelta: 0.0322,
                              longitudeDelta: 0.0221,
                          }
                        : region
                )
            )
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        handleFetch();
    }, [address]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
                <View style={styles.container}>
                    <MapView style={{width: "100%", height: "90%"}} region={region}>
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                        />
                    </MapView>
                    <Button title="SHOW" containerStyle={{width: "100%"}} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
});
