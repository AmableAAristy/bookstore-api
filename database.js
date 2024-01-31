import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/geektext";

let db;

const connectMongoDB = async () => {
    try {
        const client = await MongoClient.connect(url);
        db = client.db();
    } catch (error) {
        console.error(error);
    }
};

export { connectMongoDB, db };
