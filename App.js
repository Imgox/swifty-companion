import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { OauthContextProvider } from "./context/oauth";

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<OauthContextProvider>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen
						name="Home"
						component={Home}
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen name="Profile" component={Profile} />
				</Stack.Navigator>
			</OauthContextProvider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default App;
