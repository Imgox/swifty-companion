import React from "react";
import { Text } from "react-native";

const BoldText = ({ children, style }) => {
	return (
		<Text
			style={[
				style,
				{
					fontFamily: "Montserrat_700Bold",
				},
			]}
		>
			{children}
		</Text>
	);
};

export default BoldText;
