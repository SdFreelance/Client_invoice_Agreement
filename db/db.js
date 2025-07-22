const mongoose = require("mongoose");

const dataBase = async (req, res) => {
  try {
    const mongouri = process.env.MONGO_DB;

    if (!mongouri) {
      throw new Error(
        "Database not connected...mongo string not found in env!"
      );
    }

const dbName = 'client_service';
const cleanUri = mongouri.endsWith('/') ? mongouri.slice(0, -1) : mongouri;
const connected = await mongoose.connect(`${cleanUri}/${dbName}`);

    console.log(
      `✅ MongoDB connected: ${connected.connection.host}/${connected.connection.name}`
    );
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    if (res) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dataBase;
