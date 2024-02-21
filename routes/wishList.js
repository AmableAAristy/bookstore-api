// Author: Randy Alonso
import express from "express";
import { db } from "../db.js";

const router = express.Router();

//Adding a book to the wishlist
router.post("/wishlist/add", async (req, res) => {
  try {
    const { title, author, publicationYear, username } = req.body;

    // error retry message if book title, author, or userID does not match
    if (!title || !author || !username) {
      res
        .status(400)
        .json({
          error: "Title, author or username is missing in the request.",
        });
      return;
    }
    // inserting the book into a user's wishlist
    await db
      .collection("wishlists")
      .updateOne(
        { username },
        { $push: { books: { title, author, publicationYear } } }
      );

    res.status(200).json({ message: "Book added to the wishlist." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error message." });
  }
});

export default router;
