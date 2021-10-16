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
	ScrollView,
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
	const [projects, setProjects] = React.useState([]);
	// const max_cursuses = user.cursus_users.length;
	const level_partie_entiere = parseInt(user.cursus_users[cursusI].level);
	const level_partie_flottante = parseInt(
		(user.cursus_users[cursusI].level -
			parseInt(user.cursus_users[cursusI].level)) *
		100
	);
	/**
	 * Triggers on cursus change.
	 */
	React.useEffect(() => {
		/** Setting the level */
		const level_partie_flottante = parseInt(
			(user.cursus_users[cursusI].level -
				parseInt(user.cursus_users[cursusI].level)) *
			100
		);
		setLevel(level_partie_flottante / 100);
		/** Setting the projects */
		const projects = user.projects_users.filter(item => item.cursus_ids.includes(user.cursus_users[cursusI].cursus_id));
		setProjects(projects);
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
				<View style={styles.round_thingy}></View>
			</View>
			<ScrollView style={styles.scrollable}>
				<View style={styles.projects_title}>
					<Feather name="pie-chart" color={colors.white} size={20} />
					<Text style={styles.projects_title_text}>Projects:</Text>
				</View>
				{
					projects.map((item, index) => (
						["in_progress", "finished", "waiting_for_correction"].includes(item.status) ?
							(
								<View style={[styles.project_entry, {
									backgroundColor: index % 2 ? colors.darkText : colors.veryDarkText
								}]} key={item.project?.id}>
									<View style={styles.project_entry_col1}>{item.status === "finished" ? <Text style={[styles.final_mark, {
										color: item["validated?"] ? colors.success : colors.failure
									}]}>{item.final_mark}</Text> : <Feather name="clock" size={30} color={colors.warning} />}</View>
									<View style={styles.project_entry_col2}>
										<Text style={styles.project_name}>{item.project?.name}</Text>
									</View>
								</View>
							)
							: <></>

					))
				}
			</ScrollView>
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
		overflow: "visible",
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
		marginBottom: -20,
	},
	round_thingy: {
		width: "100%",
		height: 80,
		bottom: -35,
		zIndex: -1,
		backgroundColor: "#2F2F2F",
		borderRadius: 1000,
		position: "absolute",
	},
	scrollable: {
		zIndex: -1,
		paddingVertical: 40,
	},
	projects_title: {
		flexDirection: "row",
		marginHorizontal: 20,
		marginVertical: 10,
		alignItems: "center"
	},
	projects_title_text: {
		fontSize: 20,
		color: colors.white,
		marginHorizontal: 10,
		fontWeight: "bold"
	},
	project_entry: {
		height: 70,
		// backgroundColor: "red",
		flexDirection: "row",
		alignItems: "center",
		// paddingHorizontal: 20
	},
	project_entry_col1: {
		flex: 1,
		alignItems: "center"
	},
	project_entry_col2: {
		flex: 5
	},
	final_mark: {
		fontSize: 25,
		fontWeight: "bold",
	},
	project_name: {
		color: colors.white,
		fontSize: 15,
		// marginLeft: 10,
	}
});

export default Profile;
