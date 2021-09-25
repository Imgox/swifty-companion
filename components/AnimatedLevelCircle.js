import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
	Easing,
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import colors from "../assets/colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedLevelCircle = ({ level }) => {
	const rayon = 71;
	const perimeter = 2 * Math.PI * rayon;
	const levelProgress = useSharedValue(0);
	const levelAnimation = useAnimatedProps(() => ({
		strokeDashoffset: perimeter + perimeter * levelProgress.value,
	}));

	React.useEffect(() => {
		levelProgress.value = withTiming(level, {
			duration: 1000,
			easing: Easing.linear,
		});
	}, [level]);
	return (
		<Svg
			style={styles.level_circle}
			width="152"
			height="152"
			viewBox="0 0 154 154"
		>
			<Circle
				cx="76"
				cy="76"
				r={rayon}
				stroke={colors.darkText}
				strokeWidth="15"
			/>
			<AnimatedCircle
				cx="76"
				cy="76"
				r={rayon}
				stroke={colors.white}
				strokeDasharray={perimeter}
				strokeLinecap="round"
				strokeWidth="10"
				fill="none"
				animatedProps={levelAnimation}
			/>
		</Svg>
	);
};

export default AnimatedLevelCircle;

const styles = StyleSheet.create({
	level_circle: {
		position: "absolute",
		zIndex: 2,
		left: 142 / 2,
		top: 142 / 2,
		transform: [
			{ translateX: -(142 + 10) / 2 },
			{ translateY: -(142 + 10) / 2 },
			{ rotateZ: "90deg" },
		],
	},
});
