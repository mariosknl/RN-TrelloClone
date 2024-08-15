import { Colors } from "@/constants/Colors";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { AuthStrategy, ModalType } from "@/types/enums";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
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
	useWarmUpBrowser();
	const { signUp, setActive } = useSignUp();
	const { signIn } = useSignIn();
	const { startOAuthFlow: googleAuth } = useOAuth({
		strategy: AuthStrategy.Google,
	});
	const { startOAuthFlow: microsoftAuth } = useOAuth({
		strategy: AuthStrategy.Microsoft,
	});
	const { startOAuthFlow: slackAuth } = useOAuth({
		strategy: AuthStrategy.Slack,
	});
	const { startOAuthFlow: appleAuth } = useOAuth({
		strategy: AuthStrategy.Apple,
	});

	const onSelectedAuth = async (strategy: AuthStrategy) => {
		if (!signIn || !signUp) return;

		const selectedAuth = {
			[AuthStrategy.Google]: googleAuth,
			[AuthStrategy.Microsoft]: microsoftAuth,
			[AuthStrategy.Slack]: slackAuth,
			[AuthStrategy.Apple]: appleAuth,
		}[strategy];

		// if the user has an account in your application, but does not yet
		// have an OAuth account connected to it, you can transfer the OAuth
		// account to the existing user account.
		const userExistsButNeedsToSignIn =
			signUp.verifications.externalAccount.status === "transferable" &&
			signUp.verifications.externalAccount.error?.code ===
				"external_account_exists";

		if (userExistsButNeedsToSignIn) {
			const res = await signIn.create({ transfer: true });

			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				});
			}
		}

		const userNeedsToBeCreated =
			signIn.firstFactorVerification.status === "transferable";

		if (userNeedsToBeCreated) {
			const res = await signUp.create({
				transfer: true,
			});

			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				});
			}
		} else {
			// If the user has an account in your application
			// and has an OAuth account connected to it, you can sign them in.
			try {
				const { createdSessionId, setActive } = await selectedAuth();

				if (createdSessionId) {
					setActive!({ session: createdSessionId });
					console.log("OAuth success standard");
				}
			} catch (err) {
				console.error("OAuth error", err);
			}
		}
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
