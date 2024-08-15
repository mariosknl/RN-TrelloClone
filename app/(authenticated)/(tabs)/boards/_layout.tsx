import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Image } from "react-native";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTitle: () => (
						<Image
							source={require("@/assets/images/trello-logo-gradient-white.png")}
							style={{ width: 120, height: 50, resizeMode: "contain" }}
						/>
					),
				}}
			/>
		</Stack>
	);
};
export default Layout;
