// Author: Tarah Andre
//const express = require('express');
import express from 'express';
const router = express();
router.use(express.json());
//const mongoose = require('mongoose');
import mongoose from 'mongoose';
require('dotenv').config();
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const datab = mongoose.connection;

//creating routes
const routes = require('./routes/routes');

router.use('/api', routes);
module.exports = router;

//datab.on to connect to database
//throws error if failed connection
datab.on('error', (error) => {
    console.log(error);
})

//datab.once to run once
//shows a message if connecetion is successful
datab.once('connected', () => {
    console.log('Database connected');
})

//a schema for my database
const booksInfoSchema = new mongoose.Schema({
    ISBN: {
        required: true,
        type: Number
    },
    name: {
        required: true,
        type: String
    }, 
    description: {
        required: true,
        type: String
    }, 
    price: {
        required: true,
        type: Number
    }, 
    author: {
        required: true,
        type: String
    }, 
    genre: {
        required: true,
        type: String
    }, 
    publisher: {
        required: true,
        type: String
    }, 
    yearPublished: {
        required: true,
        type: Number
    }, 
    copiesSold: {
        required: true,
        type: String
    }
})

module.exports = mongoose.bookDetails('Data', booksInfoSchema);
const aBookDetails = require('../bookDetailss/bookDetails');

//post to database with callback for response and request
router.post('/post', async (req, res) => {
    const info = new BookDetails({
    ISBN: req.body.ISBN, 
    name: req.body.name, 
    description: req.body.description, 
    price: req.body.price, 
    author: req.body.author, 
    genre: req.body.genre, 
    publisher: req.body.publisher, 
    yearPublished: req.body.yearPublished, 
    copiesSold: req.body.copiesSold
    })

    try {
        const infoSaved = await info.save();
        res.status(200).json(infoSaved);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
})

//get data from database with callback for response and request
router.get('/getAll', async (req, res) => {
    try {
        const info = await aBookDetails.find();
        res.json(info);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

//get data based on ID with callback for response and request
router.get('/getOne/:id', async (req,res) => {
    try {
        const info = await aBookDetails.findById(req.params.id);
        res.json(info);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

//get data based on author with callback for response and request
router.get('/getOne/:author', async (req, res) => {
    try {
        const info = await aBookDetails.find(req.params.author);
        res.json(info);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

 router.listen(3000, () => {
   console.log(`A Get Call message - Tarah Andre at ${3000}`);
 })

 export default  router;


//Citations:
//1. Ninja, N. (2022, April 14). Complete MongoDB Tutorial. YouTube. https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA
//2. Onejohi. (2018, June 28). Building a simple rest API with nodejs and express. Medium.https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9
//3. lennyvita. (2023). I dont understand the basics of async, await and using JSON data to extract the info and apply it. reddit. https://www.reddit.com/r/node/comments/xv1dlm/i_dont_understand_the_basics_of_async_await_and/
//4. Fireship. (n.d.). The Async Await Episode I Promised. YouTube. https://youtu.be/vn3tm0quoqE?si=4y_ic4VJZsDrWvR2 
//5. A Tutor from STARS Tutoring helped me.
//6. Kumar, Nishant. “How to Build a RESTful API Using Node, Express, and MongoDB.” freeCodeCamp.Org, freeCodeCamp.org, 21 Feb. 2022, https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/
//7. Array.prototype.find() . MDN Web Docs. (n.d.). https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
//8.Silva, M. H. da. (n.d.). Building a Node.js/TypeScript REST API, Part 1: Express.js. Toptal Engineering Blog. https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1 