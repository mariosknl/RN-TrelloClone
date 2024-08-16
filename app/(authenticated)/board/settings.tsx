import UserListItem from "@/components/UserListItem";
import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board, User } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
} from "react-native";

const Page = () => {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const { getBoardInfo, updateBoard, deleteBoard, getBoardMember } =
		useSupabase();
	const router = useRouter();
	const [board, setBoard] = useState<Board>();
	const [member, setMember] = useState<User[]>([]);

	useEffect(() => {
		if (!id) return;

		loadInfo();
	}, [id]);

	const loadInfo = async () => {
		const data = await getBoardInfo!(id!);
		setBoard(data);

		const member = await getBoardMember!(id!);
		setMember(member);
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
			<View style={styles.container}>
				<View style={{ flexDirection: "row", gap: 14 }}>
					<Ionicons name="person-outline" size={18} color={Colors.fontDark} />
					<Text
						style={{ fontWeight: "bold", color: Colors.fontDark, fontSize: 16 }}
					>
						Members
					</Text>
				</View>

				<FlatList
					data={member}
					keyExtractor={(item) => item.id}
					renderItem={(item) => (
						<UserListItem element={item} onPress={() => {}} />
					)}
					style={{ marginVertical: 12 }}
					contentContainerStyle={{ gap: 8 }}
				/>
				<Link href={`/(authenticated)/board/invite?id=${id}`} asChild>
					<TouchableOpacity style={styles.fullBtn}>
						<Text style={{ fontSize: 16, color: Colors.fontLight }}>
							Manage board members
						</Text>
					</TouchableOpacity>
				</Link>
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
	fullBtn: {
		backgroundColor: Colors.primary,
		padding: 8,
		borderRadius: 6,
		marginLeft: 32,
		marginRight: 16,
		marginTop: 8,
		alignItems: "center",
	},
});
export default Page;
