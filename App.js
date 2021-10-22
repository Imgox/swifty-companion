import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { OauthContextProvider } from "./context/oauth";
import {
	useFonts,
	Montserrat_700Bold,
	Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();
function App() {
	const [loadFonts] = useFonts({ Montserrat_400Regular, Montserrat_700Bold });

	if (!loadFonts) return <AppLoading />;

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
					<Stack.Screen
						name="Profile"
						component={Profile}
						options={{
							headerShown: false,
						}}
					/>
				</Stack.Navigator>
			</OauthContextProvider>
		</NavigationContainer>
	);
}

export default App;
