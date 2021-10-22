import React from "react";
import { Text } from "react-native";

const BoldText = ({ children, style }) => {
	return (
		<Text
			style={[
				style,
				{
					fontFamily: "Montserrat_400Regular",
				},
			]}
		>
			{children}
		</Text>
	);
};

export default BoldText;
