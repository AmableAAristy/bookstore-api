import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        db = client.db();
    } catch (error) {
        console.error(error);
    }
};

export { connectToDatabase, db };
