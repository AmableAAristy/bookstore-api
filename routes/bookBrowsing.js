// Author: Javier Garcia
import express from "express";

const router = express.Router();

// Retrieve List of Books by Genre (http://localhost:3000/books/browse/by-genre?genre=mystery)
router.get("/books/browse/by-genre", (req, res) => {
    const genre = req.query.genre;
});

// Retrieve List of Top Sellers (http://localhost:3000/books/browse/top-sellers)
router.get("/books/browse/top-sellers", (req, res) => {});

// Retrieve List of Books for a particular rating and higher (http://localhost:3000/books/browse/by-rating?rating=5)
router.get("/books/browse/by-rating", (req, res) => {
    const rating = req.query.rating;
});

// Discount books by publisher (http://localhost:3000/books/discount-by-publisher)
router.patch("/books", (req, res) => {
    const { publisher, discountPercent } = req.body;
});

export default router;
