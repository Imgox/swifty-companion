import * as React from "react";
import {
	StyleSheet,
	TextInput,
	SafeAreaView,
	Pressable,
	Text,
	Image,
	ActivityIndicator,
	StatusBar,
} from "react-native";
import colors from "../assets/colors";
import { OauthContext } from "../context/oauth";
// import ApiService from "../services/api";

function Home({ navigation }) {
	const [login, setLogin] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const { token, expiry_timestamp } = React.useContext(OauthContext);

	React.useEffect(() => {
		if (!token) setLoading(true);
		else setLoading(false);
	}, [token]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<Image
				style={styles.logo}
				source={require("../assets/images/logo.png")}
			/>
			<TextInput
				style={styles.input}
				value={login}
				onChangeText={setLogin}
				placeholder="Login"
				placeholderTextColor={colors.lightText}
			/>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor:
							loading || !login
								? colors.disabledLight
								: pressed
								? colors.darkText
								: colors.lightText,
						color: pressed ? colors.white : colors.black,
					},
					styles.button,
				]}
				onPress={() => {
					navigation.navigate("Profile");
				}}
				disabled={loading || !login}
			>
				{loading ? (
					<ActivityIndicator color={colors.darkText} />
				) : (
					<Text>Search</Text>
				)}
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		color: colors.white,
	},
	input: {
		height: 32,
		width: 216,
		borderRadius: 20,
		backgroundColor: colors.darkText,
		paddingHorizontal: 20,
		paddingVertical: 5,
		fontSize: 18,
		marginBottom: 20,
		color: colors.white,
	},
	button: {
		width: 102,
		height: 32,
		paddingVertical: 5,
		paddingHorizontal: 20,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		marginBottom: 20,
	},
});

export default Home;
