import { connectToDatabase, db } from "./db.js";
import { books } from "./seeders/books.js";

const seedData = async () => {
    try {
        await connectToDatabase();
        await db.collection("books").createIndex({ ISBN: 1 }, { unique: true });
        await db.collection("books").insertMany(books);
        console.log("Books have been successfully inserted into the database.");
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

seedData();
