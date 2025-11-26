// components/SearchBar.js
import React from "react";
import {View, TextInput, Pressable} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

export default function SearchBar({address, onAddressChange, onSearch}) {
    return (
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
                onChangeText={onAddressChange}
            />
            <Pressable
                onPress={() => onSearch(address)}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                }}
            >
                <Octicons name="search" size={20} color="#CCCBCB" />
            </Pressable>
        </View>
    );
}
