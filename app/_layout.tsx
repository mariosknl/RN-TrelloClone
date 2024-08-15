import { Stack, useRouter, useSegments } from "expo-router";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error(
		"Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
	);
}

export interface TokenCache {
	getToken: (key: string) => Promise<string | undefined | null>;
	saveToken: (key: string, token: string) => Promise<void>;
	clearToken?: (key: string) => void;
}

// cache the Clerk JWT token
const tokenCache = {
	async getToken(key: string) {
		try {
			const item = await SecureStore.getItemAsync(key);
			if (item) {
				console.log(`${key} was used 🔐 \n`);
			} else {
				console.log("No values stored under key: " + key);
			}
			return item;
		} catch (error) {
			console.error("SecureStore get item error: ", error);
			await SecureStore.deleteItemAsync(key);
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

const InitialLayout = () => {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();

	useEffect(() => {
		if (!isLoaded) return;

		const inAuthGroup = segments[0] === "(authenticated)";

		if (isSignedIn && !inAuthGroup) {
			router.replace("/(authenticated)/(tabs)/boards");
		} else if (!isSignedIn) {
			router.replace("/");
		}
	}, [isSignedIn]);

	if (!isLoaded) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<SupabaseProvider>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
			</Stack>
		</SupabaseProvider>
	);
};

const RootLayoutNav = () => {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<ActionSheetProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<StatusBar style="light" />
					<InitialLayout />
				</GestureHandlerRootView>
			</ActionSheetProvider>
		</ClerkProvider>
	);
};

export default RootLayoutNav;
