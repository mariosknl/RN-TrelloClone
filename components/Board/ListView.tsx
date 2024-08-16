import { Colors } from "@/constants/Colors";
import { TaskList } from "@/types/enums";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Button,
	TextInput,
} from "react-native";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultTheme } from "@react-navigation/native";
import { useSupabase } from "@/context/SupabaseContext";

export interface ListViewProps {
	taskList: TaskList;
	onDelete: () => void;
}

const ListView = ({ taskList, onDelete }: ListViewProps) => {
	const [listName, setListName] = useState(taskList.title);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["40%"], []);
	const { deleteBoardList, updateBoardList } = useSupabase();

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				opacity={0.2}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
				onPress={() => bottomSheetModalRef.current?.close()}
			/>
		),
		[]
	);

	const onUpdateTaskList = async () => {
		const updated = await updateBoardList!(taskList, listName);
	};

	const onDeleteTaskList = async () => {
		await deleteBoardList!(taskList.id);
		bottomSheetModalRef.current?.close();
		onDelete();
	};

	return (
		<BottomSheetModalProvider>
			<View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.listTitle}>{listName}</Text>
						<TouchableOpacity
							onPress={() => bottomSheetModalRef.current?.present()}
						>
							<MaterialCommunityIcons
								name="dots-horizontal"
								size={22}
								color={Colors.grey}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				handleStyle={{
					backgroundColor: DefaultTheme.colors.background,
					borderRadius: 12,
				}}
				backdropComponent={renderBackdrop}
				enableOverDrag={false}
				enablePanDownToClose
			>
				<View style={styles.container}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 10,
						}}
					>
						<Button
							title="Cancel"
							onPress={() => bottomSheetModalRef.current?.close()}
						/>
					</View>
					<View
						style={{
							backgroundColor: "#fff",
							paddingHorizontal: 16,
							paddingVertical: 8,
						}}
					>
						<Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>
							List name
						</Text>
						<TextInput
							style={{ fontSize: 16, color: Colors.fontDark }}
							returnKeyType="done"
							enterKeyHint="done"
							onEndEditing={onUpdateTaskList}
							onChangeText={(e) => setListName(e)}
							value={listName}
						/>
					</View>

					<TouchableOpacity onPress={onDeleteTaskList} style={styles.deleteBtn}>
						<Text>Close List</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#F3EFFC",
		borderRadius: 4,
		padding: 6,
		marginBottom: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 8,
	},
	listTitle: {
		paddingVertical: 8,
		fontWeight: "500",
	},
	container: {
		backgroundColor: DefaultTheme.colors.background,
		flex: 1,
		gap: 16,
	},
	deleteBtn: {
		backgroundColor: Colors.white,
		padding: 8,
		marginHorizontal: 16,
		borderRadius: 6,
		alignItems: "center",
	},
});
export default ListView;
