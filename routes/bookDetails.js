// Author: Tarah Andre
const express = require('express');
const router = express.Router;

//a constant variable for books
const books = [{ISBN: 955232644930, name: 'The New Technology: Concept', 
    description: 'In this book Diana Simpson describes the concept of new technology. She first starts by giving a detailed description or definition of technology, then she describes how to build a better future with new technologies. ', 
    price: 30.00, author: 'Diana Simpson', genre: ['technology', 'computer science'], publisher: 'New Tech Inc.', 
    yearPublished: 2024, copiesSold: 200
}];

//creating routes
//adding a book's info to the system
router.post('/addbooks', async(req, res) => {
    const{ISBN, name, description, price, author, genre, publisher, yearPublished, copiesSold} = await req.body;
    if (ISBN && name && description && price && author && genre && publisher && yearPublished && copiesSold) {
        books.push({ISBN, name, description, price, author, genre, publisher, yearPublished, copiesSold});
        res.json({ok: true, books});
    }
});
//Retrieve book's info
router.get('/books', async(_, res) => {
    await res.json({ok: true, books});
});

//Retrieving a book by its ISBN
router.get('/book/:ISBN', async(req, res) => {
    const {ISBN} = await req.params;
    const book = books.filter((ISBN) => book.ISBN === ISBN)[0];
    res.json({ok: true, book});
});

//adding author with biography
const addingAnAuthorWithBiography = [{author: 'Lea Panthers', 
    biography: 'Lea is an author who had written many books. Her books have sold over 200 million copies. She currently lives in Florida and is happy to be a writer.',
    publisher: 'Not Anonymous Writer, Inc.'
}];

router.post('/books', async(req, res) => {
    const{author, biography, publisher} = req.body;
     if (author && biography && publisher) {
        books.push({author, biography, publisher});
        await res.json({ok: true, books});
     }
});

 router.get('/', (_, res) => {
   res.send('A Get Call message - Tarah Andre');
 });

 export default  router;


//Citations:
//1. A team member helped me create the branch named book-details.
//2. Ninja, N. (2022, April 14). Complete MongoDB Tutorial. YouTube. https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA
//3. 7. Onejohi. (2018, June 28). Building a simple rest API with nodejs and express. Medium.https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9
//4. A team member helped me so that I could make an additional installation for this repository.
//5. A team member helped me with my homework.
//6. lennyvita. (2023). I dont understand the basics of async, await and using JSON data to extract the info and apply it. reddit. https://www.reddit.com/r/node/comments/xv1dlm/i_dont_understand_the_basics_of_async_await_and/
//7. Fireship. (n.d.). The Async Await Episode I Promised. YouTube. https://youtu.be/vn3tm0quoqE?si=4y_ic4VJZsDrWvR2 