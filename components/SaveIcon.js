import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import colors from "../assets/colors";

const SaveIcon = ({ size, color, fill }) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 74 82">
			<Path
				d="M3 11V70.2105C3 76.354 9.63762 80.2048 14.9709 77.1555L33.0291 66.8304C35.4895 65.4237 38.5105 65.4237 40.9709 66.8304L59.0291 77.1555C64.3624 80.2048 71 76.354 71 70.2105V11C71 6.58172 67.4183 3 63 3H11C6.58172 3 3 6.58172 3 11Z"
				stroke={fill ? "none" : color}
				fill={fill ? color : "none"}
				strokeWidth={8}
			/>
		</Svg>
	);
};

SaveIcon.defaultProps = {
	size: 30,
	color: colors.white,
	fill: false,
};

export default SaveIcon;

const styles = StyleSheet.create({});
