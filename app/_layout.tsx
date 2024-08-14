import { Stack } from "expo-router";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const InitialLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
		</Stack>
	);
};

const RootLayoutNav = () => {
	return (
		<ActionSheetProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar style="light" />
				<InitialLayout />
			</GestureHandlerRootView>
		</ActionSheetProvider>
	);
};

export default RootLayoutNav;
