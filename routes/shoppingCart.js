//Author: Brandon Armstrong
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Add a book to the shopping cart
router.post("/carts", async (req, res) => {
    try {
        const { bookISBN, userId, bookName, bookAuthor, bookPrice } = req.body;

        if (!bookISBN || !userId || !bookPrice) {
            res.status(400).json({ error: "Book ISBN, User Id, or Book Price is missing in the request." });
            return;
        }

        // Check if the user already has a cart
        const existingCart = await db.collection("carts").findOne({ userId: userId });
        if (existingCart) {
            // Update the existing cart with the new book
            await db.collection("carts").updateOne({ userId: userId }, { 
                $push: { books: { bookISBN, bookName, bookAuthor, bookPrice } },
                $set: { subtotal: existingCart.subtotal + parseFloat(bookPrice) } // Update subtotal by adding book price
            });
            res.status(200).json({ message: "Book added to the cart successfully." });
        } else {
            // Create a new cart and add the book
            const newCart = {
                userId: userId,
                books: [{ bookISBN, bookName, bookAuthor, bookPrice }],
                subtotal: parseFloat(bookPrice) // Initialize subtotal with the price of the first book
            };
            await db.collection("carts").insertOne(newCart);
            res.status(200).json({ message: "Cart created successfully, book added!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});


// Retrieve the list of books in the user's shopping cart
router.get("/carts", async (req, res) => {
    const userId = req.query.userId;

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

// Retrieve the subtotal of a cart
router.get("/carts", async (req, res) => {
    const userId = req.query.userId;

    try {
        const cart = await db.collection("carts").findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        res.status(200).json({ subtotal: cart.subtotal });
    } catch (err) {
        console.error("Error retrieving subtotal:", err);
        res.status(500).json({ error: "Internal server error. Could not retrieve subtotal." });
    }
});

// Delete a book from the shopping cart instance for that user
router.delete("/carts", async (req, res) => {
    try {
        const { bookISBN, userId } = req.body;

        if (!bookISBN || !userId) {
            return res.status(400).json({ error: "Book ISBN or User Id is missing in the request." });
        }
        
        // Retrieve the book's price before deletion
        const book = await db.collection("carts").findOne({ userId: userId, "books.bookISBN": bookISBN });
        if (!book) {
            return res.status(404).json({ error: "Book not found in the cart." });
        }
        const bookPrice = parseFloat(book.bookPrice);

        // Update the cart to remove the book
        const updateResult = await db.collection("carts").updateOne({ userId }, { 
            $pull: { books: { bookISBN } }
        });

        if (updateResult.modifiedCount === 0) {
            return res.status(500).json({ error: "Failed to update the cart." });
        }

        // Get the updated cart to check if it's empty
        const updatedCart = await db.collection("carts").findOne({ userId: userId });
        if (!updatedCart || updatedCart.books.length === 0) {
            // Delete the cart if it's empty
            await db.collection("carts").deleteOne({ userId });
            return res.status(200).json({ message: "Cart deleted successfully." });
        }

        // Calculate the new subtotal based on the remaining books
        const newSubtotal = updatedCart.books.reduce((total, book) => total + parseFloat(book.bookPrice), 0);

        // Update the cart with the new subtotal
        await db.collection("carts").updateOne({ userId }, { 
            $set: { subtotal: newSubtotal }
        });

        res.status(200).json({ message: "Book removed from the cart successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});


export default router;
