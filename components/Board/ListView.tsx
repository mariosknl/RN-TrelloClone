import { Colors } from "@/constants/Colors";
import { TaskList } from "@/types/enums";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface ListViewProps {
	taskList: TaskList;
}

const ListView = ({ taskList }: ListViewProps) => {
	const [listName, setListName] = useState(taskList.title);

	return (
		<View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
			<View style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.listTitle}>{listName}</Text>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="dots-horizontal"
							size={22}
							color={Colors.grey}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
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
});
export default ListView;
