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
			<Stack.Screen
				name="board/invite"
				options={{
					presentation: "modal",
					title: "Manage board members",
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							style={{
								backgroundColor: "#E3FDE9",
								borderRadius: 16,
								padding: 6,
							}}
						>
							<Ionicons name="close" size={24} color={"#716E75"} />
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
