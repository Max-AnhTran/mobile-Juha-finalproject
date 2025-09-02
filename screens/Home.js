import {useState, useEffect} from "react";
import {StyleSheet, View} from "react-native";
import {Button, Input, Icon, ListItem, Text} from "@rneui/themed";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

export default function My_Places({navigation}) {
    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState([]);

    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    });

    const db = SQLite.openDatabaseSync("address.db");

    const initialize = async () => {
        try {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS address (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT);`
            );
        } catch (error) {
            console.error("Could not open database", error);
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    const saveAddress = async () => {
        try {
            if (!address) return;
            await db.runAsync("INSERT INTO address (address) VALUES (?);", address);
            setAddress("");
            await updateList();
        } catch (error) {
            console.error("Could not add item", error);
        }
    };

    const deleteAddress = async (id) => {
        try {
            await db.runAsync("DELETE FROM address WHERE id=?", id);
            await updateList();
        } catch (error) {
            console.error("Could not delete item", error);
        }
    };

    const updateList = async () => {
        try {
            const list = await db.getAllAsync("SELECT * from address;");
            setAddresses(list);
        } catch (error) {
            console.error("Could not get items", error);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Input
                        style={{width: "100%"}}
                        placeholder="type in address"
                        value={address}
                        label={"PLACEFINDER"}
                        onChangeText={(text) => setAddress(text)}
                    />
                    <Button containerStyle={{width: "100%", marginBottom: 20}} color={"#9e9e9e"} onPress={saveAddress}>
                        <Icon name="save" size={20} color="white" /> SAVE
                    </Button>

                    {/* <Button
                        title="MAP"
                        onPress={() =>
                            navigation.navigate("Map", {
                                region: region,
                            })
                        } // Navigate to the Map screen with region
                    /> */}

                    <View style={{width: "100%"}}>
                        {addresses.map((address, i) => (
                            <ListItem
                                key={i}
                                topDivider
                                bottomDivider
                                onLongPress={() => deleteAddress(address.id)}
                                onPress={() =>
                                    navigation.navigate("Map", {
                                        address: address.address,
                                    })
                                }
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{address.address}</ListItem.Title>
                                </ListItem.Content>
                                <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
                                    <Text style={{color: "#9e9e9e"}}>show on map</Text>
                                    <Icon name="arrow-forward-ios" size={15} color="#9e9e9e" />
                                </View>
                            </ListItem>
                        ))}
                    </View>
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
        padding: 20,
    },
});
