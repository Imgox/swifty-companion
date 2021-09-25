import axios from "axios";
import { api_path } from "../config/default";

const Api = (token = null) => {
	let data = {
		baseURL: api_path,
		headers: {
			"Content-Type": "application/json",
		},
	};
	if (token) data.headers["Authorization"] = "Bearer " + token;

	return axios.create(data);
};

export default Api;
