import { Board, TaskList, TaskListFake } from "@/types/enums";
import {
	View,
	Text,
	useWindowDimensions,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { Colors } from "@/constants/Colors";
import ListStart from "../ListStart";
import { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import ListView from "./ListView";

export interface BoardAreaProps {
	board?: Board;
}

const BoardArea = ({ board }: BoardAreaProps) => {
	const { width, height } = useWindowDimensions();
	const ref = useRef<ICarouselInstance>(null);
	const { getBoardLists, addBoardList } = useSupabase();
	const [data, setData] = useState<Array<TaskList | TaskListFake>>([
		{ id: undefined },
	]);
	const [startListActive, setStartListActive] = useState(false);
	const progress = useSharedValue(0);

	useEffect(() => {
		if (!board) return;
		loadBoardLists();
	}, [board]);

	const loadBoardLists = async () => {
		const lists = await getBoardLists!(board!.id);
		setData([...lists, { id: undefined }]);
	};

	const onSaveNewList = async (title: string) => {
		setStartListActive(false);
		const { data: newItem } = await addBoardList!(board!.id, title);
		console.log(newItem);
		data.pop();
		setData([...data, newItem, { id: undefined }]);
	};

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
			<Carousel
				data={data}
				width={width}
				height={height}
				loop={false}
				ref={ref}
				pagingEnabled
				onProgressChange={progress}
				renderItem={({ index, item }: any) => (
					<>
						{item.id && <ListView key={index} taskList={item} />}
						{item.id === undefined && (
							<View
								key={index}
								style={{ paddingTop: 20, paddingHorizontal: 30 }}
							>
								{startListActive ? (
									<ListStart
										onCancel={() => setStartListActive(false)}
										onSave={onSaveNewList}
									/>
								) : (
									<TouchableOpacity
										onPress={() => setStartListActive(true)}
										style={styles.listAddBtn}
									>
										<Text style={{ color: Colors.fontLight, fontSize: 18 }}>
											Add list
										</Text>
									</TouchableOpacity>
								)}
							</View>
						)}
					</>
				)}
			/>
			<Pagination.Basic
				data={data}
				progress={progress}
				dotStyle={{ backgroundColor: "#ffffff5c", borderRadius: 40 }}
				size={8}
				activeDotStyle={{ backgroundColor: Colors.white }}
				containerStyle={{ gap: 10, marginTop: 10 }}
				onPress={onPressPagination}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	listAddBtn: {
		backgroundColor: "#00000047",
		height: 44,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
	},
});
export default BoardArea;
