import {
	grant_type,
	client_id,
	client_secret,
	authorize_uri,
	token_storage_key,
} from "../config/default";
import ApiService from "../services/api";
import storage from "../services/storage";

const ApiHelper = {
	getToken: async () => {
		try {
			const { data } = await ApiService().post(authorize_uri, {
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
		try {
			const { access_token } = await storage.load({
				key: token_storage_key,
			});
			const { data } = await ApiService(access_token).get(`/users/${login}`);
			if (
				data &&
				Object.keys(data).length === 0 &&
				obj.constructor === Object
			) {
			} else return data;
		} catch (error) {
			throw error;
		}
	},
};

export default ApiHelper;
