import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.nfrnv7j.mongodb.net/?retryWrites=true&w=majority`;

let db;

const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(uri);
        db = client.db();
    } catch (error) {
        console.error(error);
    }
};

export { connectToDatabase, db };
