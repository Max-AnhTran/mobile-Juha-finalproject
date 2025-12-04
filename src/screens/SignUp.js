// src/screens/SignUp.js
import {useState} from "react";
import {View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Text, ActivityIndicator} from "react-native-paper";
import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import Octicons from "@expo/vector-icons/Octicons";
import {useAuth} from "../context/AuthContext";

export default function SignUp({navigation}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {signUp} = useAuth();

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await signUp(email, password, name);
            Alert.alert("Success", "Account created successfully!");
        } catch (error) {
            Alert.alert("Sign Up Failed", getErrorMessage(error.code));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/email-already-in-use":
                return "This email is already registered";
            case "auth/invalid-email":
                return "Invalid email address";
            case "auth/weak-password":
                return "Password is too weak";
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
                                <Text variant="displaySmall" style={styles.title}>
                                    Create Account
                                </Text>
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    Sign up to start your journey
                                </Text>

                                <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Full Name"
                                        placeholderTextColor="#999"
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        autoComplete="name"
                                    />
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
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

                                <Animated.View entering={FadeInUp.delay(400)} style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#999"
                                        style={styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        autoComplete="password-new"
                                    />
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(500)} style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#999"
                                        style={styles.input}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        autoComplete="password-new"
                                    />
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(600)} style={styles.buttonContainer}>
                                    <Button
                                        mode="contained"
                                        onPress={handleSignUp}
                                        disabled={loading}
                                        style={styles.button}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        {loading ? "Creating Account..." : "Sign Up"}
                                    </Button>
                                </Animated.View>

                                <Animated.View entering={FadeInUp.delay(700)} style={styles.loginContainer}>
                                    <Text style={styles.loginText}>Already have an account? </Text>
                                    <Button
                                        mode="text"
                                        onPress={() => navigation.navigate("Login")}
                                        textColor="#fff"
                                        labelStyle={styles.loginButtonLabel}
                                    >
                                        Login
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
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
    },
    loginButtonLabel: {
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
