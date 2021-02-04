const mongoose = require("mongoose");
const config = require("config");
const dbPath = config.get("mongoURI");

const connectDB = async () => {
	try {
		await mongoose.connect(dbPath, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});
		console.log("MongoDB connected!");
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = connectDB;
