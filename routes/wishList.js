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

//Removing a book to the wishlist
router.remove("/wishlist/remove", async (req, res) => {
  try {
    const { title, author, publicationYear, username } = req.body;

    // error message if information is missing (title, author, username)
    if (!title || !author || !username) {
      res.status(400).json({
        error: "Title, author or username is missing in the request.",
      });
      return;
    }

    // removing the book from the user's wishlist
    const updateResult = await db
      .collection("wishlists")
      .updateOne({ username }, { $pull: { books: { title } } });

    if (updateResult.modifiedCount === 0) {
      res.status(404).json({ message: "Book not found in the wishlist." });
      return;
    }

    res.status(200).json({ message: "Book removed from wishlist." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error message." });
  }
});

export default router;
