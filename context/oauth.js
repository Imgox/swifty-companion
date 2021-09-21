import * as React from "react";
import { AsyncStorage } from "react-native";
import ApiService from "../services/api";
import Storage from "../services/storage";

// const Context = React.createContext({});
// const OauthContext = (init) => React.useContext(Context);
const OauthContext = React.createContext();

function OauthContextProvider({ children }) {
	// const token = await getToken();
	const [state, setState] = React.useState({
		token: null,
		expiry_timestamp: null,
	});

	const generateToken = async () => {
		console.log("generit hh");
		let token = await ApiService.getToken();
		await Storage.save({
			key: "A01p16I09",
			data: { token },
			expires: token.expires_in * 1000,
		});
		setState({
			token: token.access_token,
			expiry_timestamp: (token.created_at + token.expires_in) * 1000,
		});
		return token;
	};

	const getToken = async () => {
		try {
			let { token } = await Storage.load({
				key: "A01p16I09",
			});
			if (token === null) {
				token = generateToken();
			} else {
				const token_expire_at_timestamp =
					(token.created_at + token.expires_in) * 1000;
				const current_timestamp = new Date().valueOf();

				if (token_expire_at_timestamp <= current_timestamp) {
					token = generateToken();
				} else {
					setState({
						token: token.access_token,
						expiry_timestamp: (token.created_at + token.expires_in) * 1000,
					});
				}
			}
		} catch (err) {
			console.warn(err.message);
			if (err.name) {
				if (err.name === "NotFoundError" || err.name === "ExpiredError") {
					try {
						let token = await generateToken();
					} catch (error) {
						console.log(error);
					}
				}
			}
		}
	};

	React.useEffect(() => {
		getToken();
	}, []);

	return (
		<OauthContext.Provider value={{ ...state, generateToken }}>
			{children}
		</OauthContext.Provider>
	);
}

export { OauthContextProvider, OauthContext };
