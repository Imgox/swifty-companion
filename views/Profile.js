import * as React from "react";
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Linking,
	Alert,
} from "react-native";
import colors from "../assets/colors";
import Feather from "react-native-vector-icons/Feather";
import AnimatedLevelCircle from "../components/AnimatedLevelCircle";
import { Picker } from "@react-native-community/picker";
import SaveIcon from "../components/SaveIcon";
Feather.loadFont();

function Profile({ route, navigation }) {
	const user = route.params.user_data;
	const [cursusI, setCursusI] = React.useState(0);
	const [level, setLevel] = React.useState(0);
	const max_cursuses = user.cursus_users.length;
	const level_partie_entiere = parseInt(user.cursus_users[cursusI].level);
	const level_partie_flottante = parseInt(
		(user.cursus_users[cursusI].level -
			parseInt(user.cursus_users[cursusI].level)) *
			100
	);

	React.useEffect(() => {
		const level_partie_flottante = parseInt(
			(user.cursus_users[cursusI].level -
				parseInt(user.cursus_users[cursusI].level)) *
				100
		);
		setLevel(level_partie_flottante / 100);
	}, [cursusI]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.header_navs}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Feather name="chevron-left" size={30} color={colors.white} />
					</TouchableOpacity>
					<TouchableOpacity>
						<SaveIcon size={25} />
					</TouchableOpacity>
				</View>
				<View style={styles.level_container}>
					<AnimatedLevelCircle level={level} />
					<View style={styles.level_number}>
						<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
							<Text style={styles.level_number_high}>
								{level_partie_entiere}
							</Text>
							<Text style={styles.level_number_low}>
								.{level_partie_flottante}
							</Text>
						</View>
					</View>
					<Image
						source={{
							uri: user.image_url,
						}}
						style={styles.profile_picture}
					/>
				</View>
				<Text
					style={styles.fullname}
				>{`${user.first_name} ${user.last_name}`}</Text>
				<Text style={styles.login}>{user.login}</Text>
				<View style={styles.contact_buttons}>
					{!user.email || user.email === "hidden" ? (
						<></>
					) : (
						<TouchableOpacity
							style={styles.contact_button}
							onPress={React.useCallback(async () => {
								const supported = await Linking.canOpenURL(
									`mailto:${user.email}`
								);
								if (supported) {
									await Linking.openURL(`mailto:${user.email}`);
								} else {
									Alert.alert("Error", "Cannot open mail link");
								}
							})}
						>
							<Feather name="mail" color={colors.white} size={20} />
						</TouchableOpacity>
					)}
					{!user.phone || user.phone === "hidden" ? (
						<></>
					) : (
						<TouchableOpacity
							style={styles.contact_button}
							onPress={React.useCallback(async () => {
								const supported = await Linking.canOpenURL(`tel:${user.phone}`);
								if (supported) {
									await Linking.openURL(`tel:0708030570`);
								} else {
									Alert.alert("Error", "Cannot open tel link");
								}
							})}
						>
							<Feather name="phone" color={colors.white} size={20} />
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.cursus_picker_container}>
					<Text style={{ color: colors.white, marginHorizontal: 5 }}>
						Cursus:
					</Text>
					<Picker
						selectedValue={cursusI}
						style={{
							height: 50,
							width: 230,
							color: colors.white,
						}}
						onValueChange={(itemValue) => setCursusI(itemValue)}
					>
						{user.cursus_users.map((item, key) => (
							<Picker.Item label={item.cursus.name} value={key} key={key} />
						))}
					</Picker>
				</View>
			</View>
			<View style={styles.scrollable}></View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.darkText,
		flex: 1,
	},
	header: {
		paddingTop: 10,
		backgroundColor: colors.background,
		minHeight: 300,
		// justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	header_navs: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		paddingHorizontal: 20,
		position: "absolute",
		top: 0,
		left: 0,
	},
	level_container: {
		position: "relative",
		width: 142,
		height: 142,
	},
	level_number: {
		position: "absolute",
		left: 51,
		bottom: -20,
		zIndex: 2,
		backgroundColor: colors.white,
		height: 40,
		width: 40,
		borderRadius: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	level_number_high: {
		fontSize: 16,
		fontWeight: "bold",
	},
	level_number_low: {
		fontSize: 10,
		fontWeight: "bold",
	},
	scrollable: {
		flex: 3,
	},
	profile_picture: {
		width: 142,
		height: 142,
		borderRadius: 142,
	},
	fullname: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.white,
		marginTop: 22,
	},
	login: {
		fontSize: 10,
		color: colors.white,
	},
	contact_buttons: {
		flexDirection: "row",
		marginVertical: 21,
	},
	contact_button: {
		marginHorizontal: 19,
	},
	cursus_picker_container: {
		color: colors.white,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Profile;
