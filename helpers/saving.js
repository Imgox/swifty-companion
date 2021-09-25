import { recent_storage_key } from "../config/default";
import storage from "../services/storage";

const SavingHelper = {
	setNewRecent: async (user) => {
		const newItem = {
			key: user.login,
			login: user.login,
			avatar: {
				uri: user.image_url,
			},
		};
		try {
			let recents = await storage.load({ key: recent_storage_key });
			if (recents.length > 2) recents.shift();
			recents = recents.filter((el) => el.login !== newItem.login);
			recents.push(newItem);
			await storage.save({ key: recent_storage_key, data: recents });
		} catch (error) {
			console.log(error);
		}
	},
	getRecents: async () => {
		try {
			const recents = await storage.load({ key: recent_storage_key });
			return recents;
		} catch (error) {
			throw error;
		}
	},
};

module.exports = SavingHelper;
