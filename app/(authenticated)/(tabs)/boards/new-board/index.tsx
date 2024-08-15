import { Colors } from "@/constants/Colors";
import { DEFAULT_COLOR } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";

const Page = () => {
	const [boardName, setBoardName] = useState("");
	const router = useRouter();
	const { bg } = useGlobalSearchParams<{ bg?: string }>();
	const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

	useEffect(() => {
		if (bg) {
			setSelectedColor(bg);
		}
	}, [bg]);

	const onCreateBoard = async () => {};

	return (
		<View style={{ marginVertical: 10 }}>
			<Stack.Screen
				options={{
					headerRight: () => (
						<TouchableOpacity
							onPress={onCreateBoard}
							disabled={boardName === ""}
						>
							<Text
								style={
									boardName === "" ? styles.btnTextDisabled : styles.btnText
								}
							>
								Create
							</Text>
						</TouchableOpacity>
					),
				}}
			/>

			<TextInput
				style={styles.input}
				value={boardName}
				onChangeText={setBoardName}
				placeholder="New Board"
				autoFocus
			/>

			<Link
				href="/(authenticated)/(tabs)/boards/new-board/color-select"
				asChild
			>
				<TouchableOpacity style={styles.btnItem}>
					<Text style={styles.btnItemText}>Background</Text>
					<View
						style={[styles.colorPreview, { backgroundColor: selectedColor }]}
					/>
					<Ionicons name="chevron-forward" size={22} color={Colors.grey} />
				</TouchableOpacity>
			</Link>
		</View>
	);
};
export default Page;

const styles = StyleSheet.create({
	btnTextDisabled: {
		fontSize: 18,
		fontWeight: "500",
		color: Colors.grey,
	},
	btnText: {
		fontSize: 18,
		fontWeight: "500",
		color: Colors.primary,
	},
	input: {
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.grey,
		backgroundColor: Colors.white,
		padding: 12,
		paddingHorizontal: 24,
		fontSize: 16,
		marginBottom: 32,
	},
	btnItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		backgroundColor: Colors.white,
		gap: 4,
	},
	btnItemText: {
		fontSize: 16,
		flex: 1,
	},
	colorPreview: {
		width: 24,
		height: 24,
		borderRadius: 4,
	},
});
