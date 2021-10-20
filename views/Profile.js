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
	Dimensions,
	FlatList,
	StatusBar,
} from "react-native";
import colors from "../assets/colors";
import Feather from "react-native-vector-icons/Feather";
import AnimatedLevelCircle from "../components/AnimatedLevelCircle";
import SaveIcon from "../components/SaveIcon";
import SavingHelper from "../helpers/saving";
import { saved_storage_key } from "../config/default";
import useOrientation from "../hooks/useOrientation";
import ModalDropdown from "react-native-modal-dropdown";
Feather.loadFont();

function Profile({ route, navigation }) {
	const windowWidth = Dimensions.get("window").width;
	const orientation = useOrientation();
	const user = route.params.user_data;
	const [cursusI, setCursusI] = React.useState(0);
	const [level, setLevel] = React.useState(0);
	const [projects, setProjects] = React.useState([]);
	const [skills, setSkills] = React.useState([]);
	const [saved, setSaved] = React.useState(false);
	const [selected, setSelected] = React.useState("projects");
	let level_partie_entiere;
	let level_partie_flottante;
	if (user.cursus_users[cursusI]) {
		level_partie_entiere = parseInt(user.cursus_users[cursusI].level);
		level_partie_flottante = parseInt(
			(user.cursus_users[cursusI].level -
				parseInt(user.cursus_users[cursusI].level)) *
				100
		);
	} else {
		level_partie_entiere = 0;
		level_partie_flottante = 0;
	}
	/**
	 * Check if the user is saved
	 */
	React.useEffect(() => {
		const isItSaved = async () => {
			try {
				const isSaved = await SavingHelper.savedIncludesItem(user);
				setSaved(isSaved);
			} catch (error) {
				console.log(error);
			}
		};
		isItSaved();
	}, []);
	/**
	 * Triggers on cursus change.
	 */
	React.useEffect(() => {
		/** Setting the level */
		const level_partie_flottante = user.cursus_users[cursusI]
			? parseInt(
					(user.cursus_users[cursusI].level -
						parseInt(user.cursus_users[cursusI].level)) *
						100
			  )
			: 0;
		setLevel(level_partie_flottante / 100);
		/** Setting the projects */
		const cursus_id = user.cursus_users[cursusI]
			? user.cursus_users[cursusI].cursus_id
			: -1;
		const projects = user.projects_users.filter((item) =>
			item.cursus_ids.includes(cursus_id)
		);
		const new_cursus_users = user.cursus_users.filter(
			(item) => item.cursus_id === cursus_id
		);
		if (new_cursus_users[0]) {
			setSkills(new_cursus_users[0].skills);
		}
		setProjects(projects);
	}, [cursusI]);

	const handleSave = async () => {
		try {
			if (saved) {
				await SavingHelper.removeSaved(user);
				setSaved(false);
			} else {
				await SavingHelper.setNewSaved(user);
				setSaved(true);
			}
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					try {
						const savings = [];
						await storage.save({ key: saved_storage_key, data: savings });
					} catch (error) {
						console.log(error);
					}
				}
			} else console.log(error);
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
			<View
				style={
					orientation === "portrait" ? styles.header : styles_landscape.header
				}
			>
				<View style={styles.header_navs}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Feather name="chevron-left" size={30} color={colors.white} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleSave()}>
						<SaveIcon size={25} fill={saved} />
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
									await Linking.openURL(`tel:${user.phone}`);
								} else {
									Alert.alert("Error", "Cannot open tel link");
								}
							})}
						>
							<Feather name="phone" color={colors.white} size={20} />
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.grade_wallet}>
					<View style={styles.grade_wallet_item}>
						<Text style={styles.grade_wallet_item_key}>Wallet: </Text>
						<Text style={styles.grade_wallet_item_value}>
							{user.wallet ? `${user.wallet} \u20B3` : "N/A"}
						</Text>
					</View>
					<View style={styles.grade_wallet_item}>
						<Text style={styles.grade_wallet_item_key}>Grade: </Text>
						<Text style={styles.grade_wallet_item_value}>
							{user.cursus_users[cursusI]?.grade
								? user.cursus_users[cursusI]?.grade
								: "N/A"}
						</Text>
					</View>
				</View>
				<View style={styles.cursus_picker_container}>
					<Text style={[styles.grade_wallet_item_key, { marginHorizontal: 5 }]}>
						Cursus:
					</Text>
					<ModalDropdown
						style={styles.picker}
						defaultIndex={cursusI}
						defaultValue={user.cursus_users[cursusI]?.cursus?.name}
						options={user.cursus_users.map((item) => item.cursus.name)}
						adjustFrame={(style) => ({
							...style,
							height: user.cursus_users.length * 40,
						})}
						renderRow={(option, index, selected) => (
							<View
								style={{
									paddingHorizontal: 20,
									paddingVertical: 10,
									backgroundColor: selected
										? colors.veryDarkText
										: colors.darkText,
									height: 40,
								}}
							>
								<Text
									style={{
										color: selected ? colors.white : colors.lightText,
									}}
								>
									{option}
								</Text>
							</View>
						)}
						onSelect={(index) => setCursusI(index)}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								width: 160,
								height: "100%",
							}}
						>
							<Text style={{ color: colors.white }}>
								{user.cursus_users[cursusI]?.cursus?.name}
							</Text>
							<Feather name="chevron-down" color={colors.white} />
						</View>
					</ModalDropdown>
				</View>
				{orientation === "portrait" ? (
					<View style={styles.round_thingy}></View>
				) : (
					<></>
				)}
			</View>
			<View
				style={orientation === "portrait" ? styles.col2 : styles_landscape.col2}
			>
				<View
					style={
						orientation === "portrait"
							? styles.buttons_group
							: styles_landscape.buttons_group
					}
				>
					<TouchableOpacity
						style={[
							styles.buttons_group__item,
							{
								borderColor:
									selected === "projects" ? colors.white : "#00000000",
							},
						]}
						onPress={() => setSelected("projects")}
					>
						<Feather name="pie-chart" color={colors.white} size={20} />
						<Text style={styles.projects_title_text}>Projects</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.buttons_group__item,
							{
								borderColor: selected === "skills" ? colors.white : "#00000000",
							},
						]}
						onPress={() => setSelected("skills")}
					>
						<Feather name="award" color={colors.white} size={20} />
						<Text style={styles.projects_title_text}>Skills</Text>
					</TouchableOpacity>
				</View>
				{selected === "projects" ? (
					<FlatList
						data={projects}
						keyExtractor={(item) => item.project.id.toString()}
						renderItem={({ item, index }) =>
							["in_progress", "finished", "waiting_for_correction"].includes(
								item.status
							) ? (
								<View
									style={[
										styles.project_entry,
										{
											backgroundColor:
												index % 2 ? colors.darkText : colors.veryDarkText,
										},
									]}
								>
									<View style={styles.project_entry_col1}>
										{item.status === "finished" ? (
											<Text
												style={[
													styles.final_mark,
													{
														color: item["validated?"]
															? colors.success
															: colors.failure,
													},
												]}
											>
												{item.final_mark}
											</Text>
										) : (
											<Feather name="clock" size={30} color={colors.warning} />
										)}
									</View>
									<View style={styles.project_entry_col2}>
										<Text style={styles.project_name}>
											{item.project?.name}
										</Text>
									</View>
								</View>
							) : (
								<></>
							)
						}
					/>
				) : (
					<>
						<FlatList
							data={skills}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							renderItem={({ item }) => (
								<View
									style={[
										styles.skill_entry_container,
										{
											width:
												orientation === "portrait"
													? windowWidth + 5
													: (3 * windowWidth) / 5 + 5,
											height: "100%",
										},
									]}
								>
									<View style={styles.skill_entry}>
										<Text style={styles.skill_level}>
											{item.level.toFixed(2)}
										</Text>
										<Text style={styles.skill_name}>{item.name}</Text>
									</View>
								</View>
							)}
							pagingEnabled={true}
							style={{
								width:
									orientation === "portrait"
										? windowWidth + 5
										: (3 * windowWidth) / 5 + 5,
								height: "100%",
							}}
						/>
						<View style={styles.swipe_for_more}>
							<Feather name="chevron-left" color={colors.lightText} size={10} />
							<Text style={{ color: colors.lightText, fontSize: 10 }}>
								Swipe for more
							</Text>
							<Feather
								name="chevron-right"
								color={colors.lightText}
								size={10}
							/>
						</View>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.darkText,
		flex: 1,
	},
	header: {
		paddingTop: 20,
		backgroundColor: colors.background,
		minHeight: 300,
		alignItems: "center",
		position: "relative",
		overflow: "visible",
	},
	col2: {
		// height: "100%",
		// width: "100%",
		flex: 1,
	},
	header_navs: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		paddingHorizontal: 20,
		position: "absolute",
		top: 20,
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
		fontFamily: "Montserrat-Bold",
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
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: -20,
		// width: "80%",
		position: "relative",
	},
	picker: {
		height: 50,
		width: 200,
		marginVertical: 10,
		fontWeight: "bold",
		backgroundColor: colors.darkText,
		borderRadius: 20,
		paddingHorizontal: 20,
	},
	picker_item: {
		color: colors.white,
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
		alignItems: "center",
	},
	projects_title_text: {
		fontSize: 20,
		color: colors.white,
		marginHorizontal: 10,
		fontWeight: "bold",
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
		alignItems: "center",
	},
	project_entry_col2: {
		flex: 5,
	},
	final_mark: {
		fontSize: 25,
		fontWeight: "bold",
	},
	project_name: {
		color: colors.white,
		fontSize: 15,
		// marginLeft: 10,
	},
	buttons_group: {
		marginTop: 40,
		flexDirection: "row",
		justifyContent: "center",
	},
	buttons_group__item: {
		flexDirection: "row",
		width: "50%",
		borderBottomWidth: 3,
		borderColor: colors.white,
		paddingVertical: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	skill_entry_container: {
		justifyContent: "center",
		alignItems: "center",
	},
	skill_entry: {
		backgroundColor: colors.veryDarkText,
		width: "60%",
		height: "60%",
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	skill_name: {
		color: colors.white,
		fontWeight: "bold",
	},
	skill_level: {
		fontSize: 50,
		fontWeight: "bold",
		color: colors.success,
	},
	swipe_for_more: {
		position: "absolute",
		bottom: 10,
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	grade_wallet: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
	},
	grade_wallet_item: {
		// flex: 2,
		marginHorizontal: 10,
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
	},
	grade_wallet_item_key: {
		color: colors.lightText,
		fontSize: 12,
	},
	grade_wallet_item_value: {
		color: colors.white,
		fontWeight: "bold",
		backgroundColor: colors.darkText,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 10,
		overflow: "hidden",
	},
});

const styles_landscape = StyleSheet.create({
	container: {
		backgroundColor: colors.darkText,
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	header: {
		paddingTop: 10,
		backgroundColor: colors.background,
		minHeight: 300,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		overflow: "visible",
		height: "100%",
		flex: 2,
	},
	col2: {
		flex: 3,
	},
	buttons_group: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 10,
	},
});

export default Profile;
