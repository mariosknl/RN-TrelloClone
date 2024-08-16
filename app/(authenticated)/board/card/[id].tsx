import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Task, User } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Image,
	Text,
	Button,
	FlatList,
} from "react-native";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultTheme } from "@react-navigation/native";
import UserListItem from "@/components/UserListItem";

const Page = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const {
		getCardInfo,
		getBoardMember,
		getFileFromPath,
		updateCard,
		assignCard,
	} = useSupabase();
	const [card, setCard] = useState<Task>();
	const [member, setMember] = useState<User[]>();
	const [imagePath, setImagePath] = useState<string>();

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["60%"], []);

	if (card?.image_url) {
		getFileFromPath!(card.image_url).then((path) => {
			if (path) {
				setImagePath(path);
			}
		});
	}

	useEffect(() => {
		if (!id) return;

		loadInfo();
	}, [id]);

	const loadInfo = async () => {
		const data = await getCardInfo!(id!);
		setCard(data);

		const member = await getBoardMember!(data.board_id);
		setMember(member);
	};

	const saveandClose = () => {
		updateCard!(card!);
		router.back();
	};

	const onArchiveCard = async () => {
		updateCard!({ ...card!, done: true });
		router.back();
	};

	const onAssignUser = async (user: User) => {
		const { data } = await assignCard!(card!.id, user.id);
		setCard(data);
		bottomSheetModalRef.current?.close();
	};

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

	return (
		<BottomSheetModalProvider>
			<View style={{ flex: 1 }}>
				<Stack.Screen
					options={{
						headerLeft: () => (
							<TouchableOpacity onPress={saveandClose}>
								<Ionicons name="close" size={24} color={Colors.grey} />
							</TouchableOpacity>
						),
					}}
				/>

				{card && (
					<>
						{!card.image_url && (
							<TextInput
								value={card.title}
								onChangeText={(text: string) =>
									setCard({ ...card, title: text })
								}
								style={styles.input}
							/>
						)}

						<TextInput
							style={[styles.input, { minHeight: 100 }]}
							multiline
							value={card.description ?? ""}
							onChangeText={(text: string) =>
								setCard({ ...card, description: text })
							}
						/>

						{imagePath && (
							<Image
								source={{ uri: imagePath }}
								style={{
									width: "100%",
									height: 400,
									borderRadius: 4,
									backgroundColor: Colors.white,
								}}
							/>
						)}

						<View style={styles.memberContainer}>
							<Ionicons name="person" size={24} color={Colors.grey} />

							<TouchableOpacity
								style={{ flex: 1 }}
								onPress={() => bottomSheetModalRef.current?.present()}
							>
								{!card.assigned_to ? (
									<Text>Assign...</Text>
								) : (
									<Text>
										Assigned to {card.users?.first_name ?? card.users?.email}
									</Text>
								)}
							</TouchableOpacity>
						</View>

						<TouchableOpacity onPress={onArchiveCard} style={styles.btn}>
							<Text style={styles.btnText}>Archive</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				enableOverDrag={false}
				enablePanDownToClose={true}
				backdropComponent={renderBackdrop}
				handleStyle={{
					backgroundColor: DefaultTheme.colors.background,
					borderRadius: 12,
				}}
			>
				<View style={styles.bottomContainer}>
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
					<View style={{ backgroundColor: Colors.white, padding: 10 }}>
						<FlatList
							data={member}
							keyExtractor={(item) => item.id}
							renderItem={(item) => (
								<UserListItem element={item} onPress={onAssignUser} />
							)}
							contentContainerStyle={{ gap: 8 }}
						/>
					</View>
				</View>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	input: {
		padding: 8,
		backgroundColor: Colors.white,
		borderRadius: 4,
		marginVertical: 8,
	},
	memberContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		padding: 8,
		marginVertical: 8,
		backgroundColor: Colors.white,
	},
	btn: {
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
		borderColor: Colors.white,
		borderWidth: 1,
	},
	btnText: {
		fontSize: 18,
	},
	bottomContainer: {
		backgroundColor: DefaultTheme.colors.background,
		flex: 1,
		gap: 16,
	},
});
export default Page;
