// src/screens/ForgotPassword.js
import {useState} from "react";
import {View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Text, ActivityIndicator} from "react-native-paper";
import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import Octicons from "@expo/vector-icons/Octicons";
import {useAuth} from "../context/AuthContext";

export default function ForgotPassword({navigation}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const {resetPassword} = useAuth();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email);
            Alert.alert("Success", "Password reset email sent! Please check your inbox.", [
                {text: "OK", onPress: () => navigation.goBack()},
            ]);
        } catch (error) {
            Alert.alert("Error", getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Invalid email address";
            case "auth/user-not-found":
                return "No account found with this email";
            default:
                return "An error occurred. Please try again";
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={["#8898FC", "#DBBDE7"]} style={styles.gradient}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardView}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <Button
                                    mode="text"
                                    onPress={() => navigation.goBack()}
                                    textColor="#fff"
                                    icon={() => <Octicons name="chevron-left" size={24} color="#fff" />}
                                    style={styles.backButton}
                                >
                                    Back
                                </Button>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
                                <Octicons name="mail" size={80} color="#fff" style={styles.icon} />

                                <Text variant="displaySmall" style={styles.title}>
                                    Forgot Password?
                                </Text>
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    Enter your email and we'll send you instructions to reset your password
                                </Text>

                                <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor="#999"
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(300)} style={styles.buttonContainer}>
                                    <Button
                                        mode="contained"
                                        onPress={handleResetPassword}
                                        disabled={loading}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </Animated.View>
                            </Animated.View>
                        </ScrollView>
                    </KeyboardAvoidingView>

                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" animating={true} />
                        </View>
                    )}
                </LinearGradient>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 30,
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    content: {
        width: "100%",
        alignItems: "center",
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        fontFamily: "Roboto_400Regular",
    },
    buttonContainer: {
        width: "100%",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#5A67D8",
        borderRadius: 10,
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
