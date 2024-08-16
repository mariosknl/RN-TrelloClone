import { useSupabase } from "@/context/SupabaseContext";
import { User } from "@/types/enums";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { DefaultTheme } from "@react-navigation/native";
import UserListItem from "@/components/UserListItem";

const Invite = () => {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const { findUsers, addUserToBoard } = useSupabase();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [userList, setUserList] = useState<User[]>([]);
	const headerHeight = useHeaderHeight();

	const onSearchUser = async () => {
		const users = await findUsers!(search);
		setUserList(users);
	};

	const onAddUser = async (user: User) => {
		await addUserToBoard!(id!, user.id);
		router.dismiss();
	};

	return (
		<View style={{ flex: 1, padding: 8 }}>
			<Stack.Screen
				options={{
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: DefaultTheme.colors.background,
					},
					headerSearchBarOptions: {
						inputType: "email",
						placeholder: "Invite by name, username, or email",
						autoFocus: true,
						cancelButtonText: "Done",
						onChangeText: (e) => setSearch(e.nativeEvent.text),
						onCancelButtonPress: () => onSearchUser(),
					},
				}}
			/>

			<FlatList
				data={userList}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<UserListItem element={item} onPress={onAddUser} />
				)}
				style={{ marginTop: 60 + headerHeight }}
				contentContainerStyle={{ gap: 8 }}
			/>
		</View>
	);
};
export default Invite;
