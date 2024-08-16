import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";

const Page = () => {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const { getBoardInfo, updateBoard, deleteBoard } = useSupabase();
	const router = useRouter();
	const [board, setBoard] = useState<Board>();

	useEffect(() => {
		if (!id) return;

		loadInfo();
	}, [id]);

	const loadInfo = async () => {
		const data = await getBoardInfo!(id!);
		setBoard(data);
	};

	const onUpdateBoard = async () => {
		const updated = await updateBoard!(board!);
		setBoard(updated);
	};

	const onDelete = async () => {
		await deleteBoard!(`${id}`);
		router.dismissAll();
	};

	return (
		<View>
			<View style={styles.container}>
				<Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>
					Board Name
				</Text>
				<TextInput
					value={board?.title}
					onChangeText={(text) => setBoard({ ...board!, title: text })}
					style={{ fontSize: 16, color: Colors.fontDark }}
					returnKeyType="done"
					enterKeyHint="done"
					onEndEditing={onUpdateBoard}
				/>
			</View>
			<TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
				<Text>Close Board</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		padding: 8,
		paddingHorizontal: 16,
		marginVertical: 16,
	},
	deleteBtn: {
		backgroundColor: Colors.white,
		padding: 8,
		marginHorizontal: 16,
		borderRadius: 6,
		alignItems: "center",
	},
});
export default Page;
