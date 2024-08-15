import { useAuth } from "@clerk/clerk-expo";
import { Button, View } from "react-native";

const Account = () => {
	const { signOut } = useAuth();

	return (
		<View>
			<Button title="Sign Out" onPress={() => signOut()} />
		</View>
	);
};
export default Account;
