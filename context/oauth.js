import * as React from "react";
import ApiHelper from "../helpers/api";
import Storage from "../services/storage";
import { token_storage_key } from "../config/default";

const OauthContext = React.createContext();

function OauthContextProvider({ children }) {
	// const token = await getToken();
	const [state, setState] = React.useState({
		token: null,
		expiry_timestamp: null,
	});

	const generateToken = async () => {
		try {
			let token = await ApiHelper.getToken();
			await Storage.save({
				key: token_storage_key,
				data: token,
				expires: token.expires_in * 1000,
			});
			setState({
				token: token.access_token,
				expiry_timestamp: new Date().valueOf() + token.expires_in * 1000,
			});
			return token;
		} catch (error) {
			throw error;
		}
	};

	const getToken = async () => {
		try {
			let token = await Storage.load({
				key: token_storage_key,
			});
			if (token === null) {
				token = await generateToken();
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
			if (err.name) {
				if (err.name === "NotFoundError" || err.name === "ExpiredError") {
					try {
						await generateToken();
					} catch (error) {
						setState({
							token: "error",
							expiry_timestamp: -1,
						});
					}
				}
			}
		}
	};

	React.useEffect(() => {
		getToken();
	}, []);

	return (
		<OauthContext.Provider
			value={{
				...state,
				checkAndGenerateToken: async () => {
					if (!state.token || new Date().valueOf() >= state.expiry_timestamp) {
						try {
							await generateToken();
						} catch (error) {
							throw error;
						}
					}
				},
			}}
		>
			{children}
		</OauthContext.Provider>
	);
}

export { OauthContextProvider, OauthContext };
