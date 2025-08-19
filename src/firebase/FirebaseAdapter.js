import { get, getDatabase, ref, update } from "firebase/database";

import { app } from "./config";

export class FirebaseAdapter {
	static instance = null;
	app = null;

	constructor() {
		// Singleton pattern
		if (FirebaseAdapter.instance) {
			return FirebaseAdapter.instance;
		}

		this.app = app;
		FirebaseAdapter.instance = this;
	}

	getConfigData = async () => {
		try {
			// Save to realtime database
			const db = getDatabase(this.app);
			const reference = ref(db, "pos/config");
			const snapshot = await get(reference);
			return snapshot.val();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	saveConfigData = async (data) => {
		try {
			// Save to realtime database
			const db = getDatabase(this.app);
			const reference = ref(db, "pos/config");
			await update(reference, data);
			return {
				success: true,
				data: "Data saved successfully",
			};
		} catch (error) {
			console.error(error);
			return {
				success: false,
				error: error,
			};
		}
	};
}
