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
	Dimensions,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import colors from "../assets/colors";
import { OauthContext } from "../context/oauth";
import ApiHelper from "../helpers/api";
import SavingHelper from "../helpers/saving";
import Feather from "react-native-vector-icons/Feather";
import SaveIcon from "../components/SaveIcon";
import useOrientation from "../hooks/useOrientation";
import BoldText from "../components/BoldText";
import RegularText from "../components/RegularText";
Feather.loadFont();

function Home({ navigation }) {
	const [login, setLogin] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [recents, setRecents] = React.useState([]);
	const [saved, setSaved] = React.useState([]);
	const orientation = useOrientation();
	const { token, checkAndGenerateToken } = React.useContext(OauthContext);

	React.useEffect(() => {
		if (!token) setLoading(true);
		else if (token === "error") {
			Alert.alert(
				"Connection error",
				"We can't reach the 42 intranet servers, please try again later."
			);
			setLoading(false);
		} else setLoading(false);
	}, [token]);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			(async () => {
				try {
					let r = await SavingHelper.getRecents();
					let s = await SavingHelper.getSaved();
					setRecents(r);
					setSaved(s);
				} catch (error) {
					console.log(error);
				}
			})();
		});

		return unsubscribe;
	}, [navigation]);

	const refreshSaved = async () => {
		try {
			let s = await SavingHelper.getSaved();
			setSaved(s);
		} catch (error) {
			console.log(error);
		}
	};

	const findUser = async (loginQuery = "") => {
		let final_login = loginQuery !== "" ? loginQuery : login;
		final_login = final_login.trim().toLowerCase();
		setLoading(true);
		try {
			await checkAndGenerateToken();
			const user_data = await ApiHelper.findUser(final_login);
			await SavingHelper.setNewRecent(user_data);
			setLoading(false);
			navigation.navigate("Profile", { user_data });
		} catch (error) {
			console.log("dfdfdfdf", error);
			setLoading(false);
			if (
				error.response &&
				error.response.status &&
				error.response.status === 404
			) {
				Alert.alert("User not found", "Please check your login and try again");
			} else {
				console.log(error);
			}
		}
	};

	return (
		<SafeAreaView
			style={
				orientation === "portrait"
					? styles.container
					: styles_landscape.container
			}
		>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View
					style={orientation === "portrait" ? styles.row : styles_landscape.row}
				>
					<View
						style={
							orientation === "portrait" ? styles.col1 : styles_landscape.col1
						}
					>
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
							onSubmitEditing={() => findUser(login)}
						/>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor:
										loading || !login || token === "error"
											? colors.disabledLight
											: pressed
											? colors.darkText
											: colors.lightText,
									color: pressed ? colors.white : colors.black,
								},
								styles.button,
							]}
							onPress={() => findUser(login)}
							disabled={loading || !login || token === "error"}
						>
							{loading ? (
								<ActivityIndicator color={colors.darkText} />
							) : (
								<BoldText style={{ color: colors.darkText }}>Search</BoldText>
							)}
						</Pressable>
					</View>
					{recents.length === 0 && saved.length === 0 ? (
						<></>
					) : (
						<View
							style={
								orientation === "portrait" ? styles.col2 : styles_landscape.col2
							}
						>
							{recents.length !== 0 ? (
								<>
									<View style={styles.heading_wrapper}>
										<Feather name="clock" size={20} color={colors.white} />
										<BoldText style={styles.heading}>Recent</BoldText>
									</View>
									<View style={styles.recents_container}>
										{recents.map((item) => (
											<TouchableOpacity
												key={item.login}
												style={styles.recent_entry}
												onPress={() => {
													findUser(item.login);
												}}
											>
												<View style={styles.saving_entry}>
													<View style={styles.saving_entry_data}>
														<Image
															style={styles.saving_avatar}
															source={item.avatar}
														/>
														<RegularText style={styles.saving_login}>
															{item.login}
														</RegularText>
													</View>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</>
							) : (
								<></>
							)}
							{saved.length !== 0 ? (
								<>
									<View style={styles.heading_wrapper}>
										<SaveIcon fill size={20} color={colors.white} />
										<BoldText style={styles.heading}>Saved</BoldText>
									</View>
									<FlatList
										style={{ width: "100%", marginTop: 10 }}
										data={saved}
										renderItem={({ item }) => (
											<TouchableOpacity
												key={item.login}
												onPress={() => findUser(item.login)}
											>
												<View style={styles.saving_entry}>
													<View style={styles.saving_entry_data}>
														<Image
															style={styles.saving_avatar}
															source={item.avatar}
														/>
														<RegularText style={styles.saving_login}>
															{item.login}
														</RegularText>
													</View>
													<TouchableOpacity
														style={{ alignItems: "center" }}
														onPress={async () => {
															await SavingHelper.removeSaved(item);
															await refreshSaved();
														}}
													>
														<SaveIcon size={20} />
														<RegularText
															style={{ color: colors.white, fontSize: 8 }}
														>
															Unsave
														</RegularText>
													</TouchableOpacity>
												</View>
											</TouchableOpacity>
										)}
									/>
								</>
							) : (
								<></>
							)}
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>
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
		paddingTop: 50,
	},
	row: { width: "100%", height: "100%" },
	col1: { flex: 1, justifyContent: "center", alignItems: "center" },
	col2: { flex: 3 },
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
		// marginTop: 20,
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
		justifyContent: "space-between",
	},
	saving_entry_data: {
		flexDirection: "row",
		alignItems: "center",
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
	recents_container: {
		flexDirection: "column-reverse",
		width: "100%",
	},
});

const styles_landscape = StyleSheet.create({
	container: {
		backgroundColor: colors.background,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		color: colors.white,
	},
	row: { flexDirection: "row", width: "100%", height: "100%" },
	col1: { flex: 3, justifyContent: "center", alignItems: "center" },
	col2: { flex: 3, paddingTop: 20 },
});

export default Home;
