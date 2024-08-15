import { Colors } from "@/constants/Colors";
import { COLORS, DEFAULT_COLOR } from "@/types/enums";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Page = () => {
	const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
	const router = useRouter();

	const onColorSelect = (color: string) => {
		setSelectedColor(color);
		router.setParams({ bg: color });
	};

	return (
		<View
			style={{
				flexDirection: "row",
				flexWrap: "wrap",
				justifyContent: "center",
			}}
		>
			{COLORS.map((color) => (
				<TouchableOpacity
					key={color}
					onPress={() => onColorSelect(color)}
					style={{
						backgroundColor: color,
						height: 100,
						width: 100,
						margin: 10,
						borderRadius: 4,
						borderWidth: selectedColor === color ? 2 : 0,
						borderColor: Colors.fontDark,
					}}
				/>
			))}
		</View>
	);
};
export default Page;
