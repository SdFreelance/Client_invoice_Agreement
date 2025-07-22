const mongoose = require('mongoose');

const dataBase = async (req, res) => {
  try {
    const mongouri = process.env.MONGO_DB;

    if (!mongouri) {
      throw new Error('Database not connected...mongo string not found in env!');
    }

    const connected = await mongoose.connect(mongouri);
    console.log(`✅ MongoDB connected: ${connected.connection.host}`);

  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    if (res) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dataBase;
