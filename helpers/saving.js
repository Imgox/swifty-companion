import { recent_storage_key, saved_storage_key } from "../config/default";
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
			const isThere = await SavingHelper.recentsIcludeItem(newItem);
			if (recents.length > 2 && !isThere) {
				recents.shift();
			}
			recents = recents.filter((el) => el.login !== newItem.login);
			recents.push(newItem);
			await storage.save({ key: recent_storage_key, data: recents });
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initRecents(newItem);
				}
			} else console.log(error);
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
	recentsIcludeItem: async (item) => {
		try {
			const recents = await storage.load({ key: recent_storage_key });
			for (let i = 0; recents[i]; i++) {
				if (recents[i].login === item.login) return true;
			}
			return false;
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initRecents();
				}
			} else console.log(error);
		}
	},
	savedIncludesItem: async (item) => {
		try {
			const recents = await storage.load({ key: saved_storage_key });
			for (let i = 0; recents[i]; i++) {
				if (recents[i].login === item.login) return true;
			}
			return false;
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initSaved();
				}
			} else console.log(error);
		}
	},
	setNewSaved: async (user) => {
		const newItem = {
			key: user.login,
			login: user.login,
			avatar: {
				uri: user.image_url,
			},
		};
		try {
			let saved = await storage.load({ key: saved_storage_key });
			if (saved.length >= 30) throw "max_reached";
			else {
				const isThere = await SavingHelper.savedIncludesItem(newItem);
				if (!isThere) saved.push(newItem);
			}
			await storage.save({ key: saved_storage_key, data: saved });
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initSaved(newItem);
				}
			} else console.log(error);
		}
	},
	removeSaved: async (user) => {
		const key = user.login;
		try {
			const saved = await storage.load({ key: saved_storage_key });
			const new_saved = saved.filter((item) => item.key !== key);
			await storage.save({ key: saved_storage_key, data: new_saved });
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initSaved();
				}
			} else console.log(error);
		}
	},
	getSaved: async () => {
		try {
			const saved = await storage.load({ key: saved_storage_key });
			return saved;
		} catch (error) {
			if (error.name) {
				if (error.name === "NotFoundError" || error.name === "ExpiredError") {
					SavingHelper.initSaved();
				}
			} else console.log(error);
		}
	},
	initSaved: async (newItem = null) => {
		try {
			const savings = [];
			if (newItem) savings.push(newItem);
			await storage.save({ key: saved_storage_key, data: savings });
		} catch (error) {
			console.log(error);
		}
	},
	initRecents: async (newItem = null) => {
		try {
			const savings = [];
			if (newItem) savings.push(newItem);
			await storage.save({ key: recent_storage_key, data: savings });
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = SavingHelper;
