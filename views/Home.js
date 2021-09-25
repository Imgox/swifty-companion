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
	Alert,
	TouchableOpacity,
	View,
	FlatList,
} from "react-native";
import colors from "../assets/colors";
import { recent_storage_key } from "../config/default";
import { OauthContext } from "../context/oauth";
import ApiHelper from "../helpers/api";
import SavingHelper from "../helpers/saving";
import storage from "../services/storage";
import Feather from "react-native-vector-icons/Feather";
import SaveIcon from "../components/SaveIcon";
Feather.loadFont();

function Home({ navigation }) {
	const [login, setLogin] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [recents, setRecents] = React.useState([]);
	const { token, checkAndGenerateToken } = React.useContext(OauthContext);

	React.useEffect(() => {
		if (!token) setLoading(true);
		else setLoading(false);
	}, [token]);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			(async () => {
				try {
					const r = await SavingHelper.getRecents();
					setRecents(r.reverse());
				} catch (error) {
					if (error.name) {
						if (
							error.name === "NotFoundError" ||
							error.name === "ExpiredError"
						) {
							try {
								const savings = [];
								await storage.save({ key: recent_storage_key, data: savings });
							} catch (error) {
								console.log(error);
							}
						}
					} else console.log(error);
				}
			})();
		});

		return unsubscribe;
	}, [navigation]);

	const findUser = async () => {
		setLoading(true);
		try {
			await checkAndGenerateToken();
			const user_data = await ApiHelper.findUser(login);
			await SavingHelper.setNewRecent(user_data);
			setLoading(false);
			navigation.navigate("Profile", { user_data });
		} catch (error) {
			setLoading(false);
			if (
				error.response &&
				error.response.status &&
				error.response.status === 404
			) {
				Alert.alert("User not found", "Please check your login and try again");
			} else console.log(error);
		}
	};

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
				onPress={findUser}
				disabled={loading || !login}
			>
				{loading ? (
					<ActivityIndicator color={colors.darkText} />
				) : (
					<Text>Search</Text>
				)}
			</Pressable>
			<View style={styles.heading_wrapper}>
				<Feather name="clock" size={20} color={colors.white} />
				<Text style={styles.heading}>Recent</Text>
			</View>
			<FlatList
				style={{ width: "100%", marginTop: 10 }}
				data={recents}
				renderItem={({ item }) => (
					<TouchableOpacity key={item.login}>
						<View style={styles.saving_entry}>
							<Image style={styles.saving_avatar} source={item.avatar} />
							<Text style={styles.saving_login}>{item.login}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
			{/* <View style={styles.heading_wrapper}>
				<SaveIcon fill size={20} color={colors.white} />
				<Text style={styles.heading}>Saved</Text>
			</View>
			<FlatList
				style={{ width: "100%", marginTop: 10 }}
				data={recents}
				renderItem={({ item }) => (
					<TouchableOpacity key={item.login}>
						<View style={styles.saving_entry}>
							<Image style={styles.saving_avatar} source={item.avatar} />
							<Text style={styles.saving_login}>{item.login}</Text>
						</View>
					</TouchableOpacity>
				)}
			/> */}
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
	heading_wrapper: {
		flexDirection: "row",
		justifyContent: "flex-start",
		width: "100%",
		paddingHorizontal: 20,
		alignItems: "center",
		marginTop: 20,
	},
	heading: {
		color: colors.white,
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 5,
	},
	saving_entry: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	saving_avatar: {
		width: 40,
		height: 40,
		borderRadius: 40,
		marginRight: 10,
	},
	saving_login: {
		fontSize: 15,
		color: colors.white,
	},
});

export default Home;
