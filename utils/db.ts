// utils/db.js
import mongoose from 'mongoose';

const databaseUrl = "mongodb+srv://imankitkalirawana:wlbhubNr4faNM8Sb@portfolio.x2ygf7y.mongodb.net/devocode";

const connectDB = async () => {
    try {
        await mongoose.connect(databaseUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export { connectDB };
