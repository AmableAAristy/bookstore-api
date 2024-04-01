import express from "express";
import { db } from "../db.js";
import { ObjectId } from 'mongodb';

const router = express.Router();

// Add a book to the shopping cart
router.post("/carts", async (req, res) => {
    try {
        const { bookISBN, userId, bookName, bookAuthor, bookPrice } = req.body;

        if (!bookISBN || !userId) {
            res.status(400).json({ error: "Book ISBN or User Id is missing in the request." });
            return;
        }

        // Implement logic to add the book to the user's cart
        // Update the user's cart in the database
        const newCart = { bookISBN, bookName, bookAuthor, bookPrice};
        if (bookISBN) newCart.bookISBN = bookISBN;
        if (bookName) newCart.bookName = bookName;
        if (bookAuthor) newCart.bookAuthor = bookAuthor;
        if (bookPrice) newCart.bookPrice = bookPrice;

        const result = await db.collection("carts").insertOne(newCart);
        if (!result) {
            console.error("Insertion failed: ", result);
            return res.status(500).json({ error: "Could not create a new cart." })
        }
        const response = {
            message: "Cart created successfully, book added!"
        };
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

// Retrieve the list of books in the user's shopping cart
router.get("/carts", async (req, res) => {
    const userId = req.query.id;

    try {
        const foundUser = await db.collection("carts").findOne({ userId: userId });
        if (!foundUser) {
            return res.status(404).json({ error: "User not found." });
        }

       
        // const cart = await db.collection("carts").findOne({ _id: new ObjectId(cartId) });
        // if (!cart) {
        //     return res.status(404).json({ error: "Cart not found." });
        // }

        res.status(200).json(foundUser);
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).json({ error: "Internal server error. Could not retrieve cart." });
    }
});

// Delete a book from the shopping cart instance for that user
router.delete("/carts/delete", async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            return res.status(400).json({ error: "Book Id or User Id is missing in the request." });
        }
        
        await db.collection("carts").updateOne({ userId }, { $pull: { books: bookId } });

        res.status(200).json({ message: "Book removed from the cart successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

export default router;
