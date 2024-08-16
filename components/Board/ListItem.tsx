import { Colors } from "@/constants/Colors";
import { Task } from "@/types/enums";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
	RenderItemParams,
	ScaleDecorator,
} from "react-native-draggable-flatlist";

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
	const router = useRouter();

	const openLink = () => {
		router.push(`/board/card/${item.id}`);
	};
	return (
		<ScaleDecorator>
			<TouchableOpacity
				onLongPress={drag}
				disabled={isActive}
				onPress={openLink}
				style={[styles.rowItem, { opacity: isActive ? 0.5 : 1 }]}
			>
				{!item.image_url && (
					<View>
						<Text>{item.title}</Text>
					</View>
				)}
			</TouchableOpacity>
		</ScaleDecorator>
	);
};

const styles = StyleSheet.create({
	rowItem: {
		padding: 8,
		backgroundColor: Colors.white,
		borderRadius: 4,
	},
});
export default ListItem;
