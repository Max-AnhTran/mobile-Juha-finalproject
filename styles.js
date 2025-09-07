import {StyleSheet} from "react-native";

export default StyleSheet.create({
    safeAreaZone: {
        position: "relative",
        flex: 1,
        backgroundColor: "#fff",
        zIndex: -1,
    },
    container: {
        position: "relative",
        flex: 1,
        flexDirection: "column",
        zIndex: 1,
        paddingHorizontal: 30,
    },
    background: {
        position: "absolute",
        inset: 0,
    },
    earth: {
        position: "absolute",
        bottom: -70,
        right: -170,
        width: "150%",
        resizeMode: "contain",
    },
    loading: {
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
});
