import express from "express";
import { db } from "../db.js";
import { ObjectId } from 'mongodb';

const router = express.Router();

// Add a book to the shopping cart
// Add a book to the shopping cart
router.post("/carts", async (req, res) => {
    try {
        const { bookISBN, userId, bookName, bookAuthor, bookPrice } = req.body;

        if (!bookISBN || !userId) {
            res.status(400).json({ error: "Book ISBN or User Id is missing in the request." });
            return;
        }

        // Check if the user already has a cart
        const existingCart = await db.collection("carts").findOne({ userId: userId });
        if (existingCart) {
            // Update the existing cart with the new book
            await db.collection("carts").updateOne({ userId: userId }, { $push: { books: { bookISBN, bookName, bookAuthor, bookPrice } } });
            res.status(200).json({ message: "Book added to the cart successfully." });
        } else {
            // Create a new cart and add the book
            const newCart = {
                userId: userId,
                books: [{ bookISBN, bookName, bookAuthor, bookPrice }]
            };
            const result = await db.collection("carts").insertOne(newCart);
            if (!result) {
                console.error("Insertion failed: ", result);
                return res.status(500).json({ error: "Could not create a new cart." });
            }
            res.status(200).json({ message: "Cart created successfully, book added!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});


// Retrieve the list of books in the user's shopping cart
router.get("/carts", async (req, res) => {
    const userId = req.query.userId; // Corrected from req.query.id

    try {
        const foundCart = await db.collection("carts").findOne({ userId: userId });
        if (!foundCart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        res.status(200).json(foundCart);
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).json({ error: "Internal server error. Could not retrieve cart." });
    }
});


// Delete a book from the shopping cart instance for that user
router.delete("/carts", async (req, res) => {
    try {
        const { bookISBN, userId } = req.body;

        if (!bookISBN || !userId) {
            return res.status(400).json({ error: "Book ISBN or User Id is missing in the request." });
        }
        
        await db.collection("carts").updateOne({ userId }, { $pull: { books: { bookISBN } } });

        res.status(200).json({ message: "Book removed from the cart successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

export default router;
