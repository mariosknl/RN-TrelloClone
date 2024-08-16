import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Task } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
	RenderItemParams,
	ScaleDecorator,
} from "react-native-draggable-flatlist";

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
	const router = useRouter();
	const { getFileFromPath } = useSupabase();
	const [imagePath, setImagePath] = useState<string>();

	if (item.image_url) {
		getFileFromPath!(item.image_url).then((path) => {
			if (path) {
				setImagePath(path);
			}
		});
	}

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
				{!item.image_url ? (
					<View>
						<Text>{item.title}</Text>
					</View>
				) : (
					<>
						{imagePath && (
							<Image
								source={{ uri: imagePath }}
								style={{
									width: "100%",
									height: 200,
									borderRadius: 4,
									backgroundColor: Colors.white,
								}}
							/>
						)}
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={{ flex: 1 }}>{item.title}</Text>
							{item.assigned_to && (
								<Ionicons
									name="person-circle-outline"
									size={16}
									color={Colors.black}
								/>
							)}
						</View>
					</>
				)}
				{!item.image_url && (
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text style={{ flex: 1 }}>{item.title}</Text>
						{item.assigned_to && (
							<Ionicons name="person-circle-outline" size={16} color={"#000"} />
						)}
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
