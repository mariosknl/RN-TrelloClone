import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const Layout = () => {
	const router = useRouter();
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="board/settings"
				options={{
					presentation: "modal",
					title: "Board Menu",
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name="close" size={24} color={"#716E75"} />
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
