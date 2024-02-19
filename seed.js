import { connectToDatabase, db } from "./db.js";
import { books } from "./seeders/books.js";

const seedData = async () => {
    try {
        await connectToDatabase();

        // Create index if it doesn't exist
        await db.collection("books").createIndex({ ISBN: 1 }, { unique: true }).catch((error) => {
            if (error.code !== 85) {
                // Ignore the error if it's due to an existing index
                console.error(error);
            }
        });

        // Insert books only if they don't exist
        for (const book of books) {
            try {
                await db.collection("books").insertOne(book);
                console.log(`Book with ISBN ${book.ISBN} inserted into the database.`);
            } catch (error) {
                if (error.code !== 11000) {
                    // Ignore duplicate key errors, log other errors
                    console.error(error);
                } else {
                    console.log(`Book with ISBN ${book.ISBN} already exists in the database. Skipping insertion.`);
                }
            }
        }

        console.log("Books have been successfully inserted into the database.");
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

seedData();

