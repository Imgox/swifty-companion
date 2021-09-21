import axios from "axios";
import config from "../config/default.json";

const { grant_type, client_id, client_secret, authorize_uri } = config;

const ApiService = {
	getToken: async () => {
		try {
			const { data } = await axios.post(authorize_uri, {
				grant_type,
				client_id,
				client_secret,
			});
			return data;
		} catch (error) {
			throw error;
		}
	},
	findUser: async (login) => {
		/* TO DO */
	},
};

export default ApiService;
