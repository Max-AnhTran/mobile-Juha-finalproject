// src/screens/Login.js
import {useState} from "react";
import {View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Text, ActivityIndicator} from "react-native-paper";
import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import {useAuth} from "../context/AuthContext";

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {signIn} = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            await signIn(email, password);
            // Navigation handled by App.js based on auth state
        } catch (error) {
            Alert.alert("Login Failed", getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Invalid email address";
            case "auth/user-disabled":
                return "This account has been disabled";
            case "auth/user-not-found":
                return "No account found with this email";
            case "auth/wrong-password":
                return "Incorrect password";
            case "auth/invalid-credential":
                return "Invalid email or password";
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
                            <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
                                <Text variant="displaySmall" style={styles.title}>
                                    Welcome Back
                                </Text>
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    Sign in to continue your adventure
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

                                <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#999"
                                        style={styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        autoComplete="password"
                                    />
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(400)} style={styles.buttonContainer}>
                                    <Button
                                        mode="contained"
                                        onPress={handleLogin}
                                        disabled={loading}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(500)}>
                                    <Button
                                        mode="text"
                                        onPress={() => navigation.navigate("ForgotPassword")}
                                        textColor="#fff"
                                        style={styles.forgotButton}
                                    >
                                        Forgot Password?
                                    </Button>
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(600)} style={styles.signupContainer}>
                                    <Text style={styles.signupText}>Don't have an account? </Text>
                                    <Button
                                        mode="text"
                                        onPress={() => navigation.navigate("SignUp")}
                                        textColor="#fff"
                                        labelStyle={styles.signupButtonLabel}
                                    >
                                        Sign Up
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
    content: {
        width: "100%",
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
    },
    inputContainer: {
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
        marginTop: 10,
        marginBottom: 15,
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
    forgotButton: {
        marginTop: 5,
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    signupText: {
        color: "#fff",
        fontSize: 16,
    },
    signupButtonLabel: {
        fontSize: 16,
        fontWeight: "bold",
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
