// Author: Randy Alonso
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Adding a book to the wishlist
router.post("/wishlist/add", async (req, res) => {
  try {
    const { title, author, publicationYear, username } = req.body;

    // error retry message if book title, author, or userID does not match
    if (!title || !author || !username) {
      res.status(400).json({
        error: "Title, author or username is missing in the request.",
      });
      return;
    }

    // Check if the wishlist exists for the user
    const wishlist = await db.collection("wishlists").findOne({ username });

    if (!wishlist) {
      // Wishlist doesn't exist, create a new one
      await db.collection("wishlists").insertOne({
        username,
        books: [{ title, author, publicationYear }],
      });
      res.status(200).json({ message: "New wishlist created and book added." });
    } else {
      // inserting the book into a user's wishlist
      await db
        .collection("wishlists")
        .updateOne(
          { username },
          { $push: { books: { title, author, publicationYear } } }
        );
      res.status(200).json({ message: "Book added to the wishlist." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error message." });
  }
});

//Removing a book to the wishlist
router.delete("/wishlist/remove", async (req, res) => {
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
            res.status(404).json({
                message: "Book not found in the wishlist.",
            });
            return;
        }

        res.status(200).json({ message: "Book removed from wishlist." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error message." });
    }
});

// Viewing a book in the wishlist
router.get(" /wishlist/view", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      res.status(400).json({
        error: "Username is missing in the request.",
      });
      return;
    }

    // Viewing the book from the user's wishlist
    const wishlist = await db.collection("wishlists").findOne({ username });

    if (!wishlist) {
      res.status(404).json({
        error: "Wishlist not found for username",
      });
      return;
    }

    res.status(200).json(booksInWishList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error message. Try again." });
  }
});

// Archive a wishlist
router.patch("/wishlist/archive", async (req, res) => {
  try {
    const { username } = req.body;

    // Check username
    if (!username) {
      res.status(400).json({
        error: "Username is missing in the request.",
      });
      return;
    }

    // if wishlist exists
    const wishlist = await db.collection("wishlists").findOne({ username });

    if (!wishlist) {
      res.status(404).json({ error: "Wishlist not found for username." });
      return;
    }

    // Update the wishlist to mark it as archived
    await db.collection("wishlists").updateOne(
      { username },
      { $set: { archived: true } }
    );

    res.status(200).json({ message: "Wishlist has been archived." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while trying to archive the wishlist." });
  }
});

export default router;
