// Author: Brandon Armstrong
import express from "express";
import { db } from "../db.js";

const router = express.Router();

//************************************* */
// Add a book to the shopping cart
//************************************* */
router.post("/cart/add", async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            res.status(400).json({ error: "Book Id or User Id is missing in the request." });
            return;
        }

        // Implement logic to add the book to the user's cart
        // Update the user's cart in the database
        await db.collection("carts").updateOne({ userId }, { $push: { books: bookId } });

        res.status(200).json({ message: "Book added to the cart successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});
//************************************* */
//Retrieve the list of books in the user's shopping cart
//************************************* */
//************************************* */
//Delete a book from the shopping cart instance for that user
//************************************* */
router.delete("/cart/delete", async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            res.status(400).json({ error: "Book Id or User Id is missing in the request." });
            return;
        }

        // Implement logic to delete the book from the user's cart
        // Update the user's cart in the database
        await db.collection("carts").updateOne({ userId }, { $pull: { books: bookId } });

        res.status(200).json({ message: "Book removed from the cart successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});
//************************************* */
//Helper function to calculate subtotal
//************************************* */
//************************************* */
// Retrieve the subtotal price of all items in the user’s shopping cart.
//************************************* */

export default router;