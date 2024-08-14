import { Colors } from "@/constants/Colors";
import { AuthStrategy, ModalType } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const LOGIN_OPTIONS = [
	{
		text: "Continue with Google",
		icon: require("@/assets/images/login/google.png"),
		strategy: AuthStrategy.Google,
	},
	{
		text: "Continue with Microsoft",
		icon: require("@/assets/images/login/microsoft.png"),
		strategy: AuthStrategy.Microsoft,
	},
	{
		text: "Continue with Apple",
		icon: require("@/assets/images/login/apple.png"),
		strategy: AuthStrategy.Apple,
	},
	{
		text: "Continue with Slack",
		icon: require("@/assets/images/login/slack.png"),
		strategy: AuthStrategy.Slack,
	},
];
interface AuthModalProps {
	authType: ModalType | null;
}

const AuthModal = ({ authType }: AuthModalProps) => {
	const onSelectedAuth = async (strategy: AuthStrategy) => {
		console.log(strategy);
		// Todo: Clerk Auth
	};
	return (
		<BottomSheetView style={styles.modalContainer}>
			<TouchableOpacity style={styles.modalBtn}>
				<Ionicons name="mail-outline" size={20} />
				<Text style={styles.btnText}>
					{authType === ModalType.Login
						? "Log in with email"
						: "Sign up with email"}
				</Text>
			</TouchableOpacity>
			{LOGIN_OPTIONS.map((option) => (
				<TouchableOpacity
					key={option.strategy}
					style={styles.modalBtn}
					onPress={() => onSelectedAuth(option.strategy)}
				>
					<Image source={option.icon} style={styles.btnIcon} />
					<Text style={styles.btnText}>{option.text}</Text>
				</TouchableOpacity>
			))}
		</BottomSheetView>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		alignItems: "flex-start",
		padding: 20,
		gap: 20,
	},
	modalBtn: {
		flexDirection: "row",
		gap: 14,
		alignItems: "center",
	},
	btnText: {
		fontSize: 18,
	},
	btnIcon: {
		width: 20,
		height: 20,
		resizeMode: "contain",
	},
});

export default AuthModal;
