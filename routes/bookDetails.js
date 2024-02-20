// Author: Tarah Andre
import express from "express";
const router = express.Router();

//a constant variable for books (my imaginary book[s])
const books = [{
    ISBN: 955232644930, 
    name: 'The New Technology: Concept', 
    description: 'In this book Diana Simpson describes the concept of new technology. She first starts by giving a detailed description or definition of technology, then she describes how to build a better future with new technologies. ', 
    price: 30.00, 
    author: 'Diana Simpson', 
    genre: ['technology', 'computer science'], 
    publisher: 'New Tech Inc.', 
    yearPublished: 2024, 
    copiesSold: 200
}];

//creating routes
//adding a book's info to the system
async function postBooks() {
    let myBooks = new Promise(function(resolve) {
        let req = new XMLHttpRequest();
        req.open('POST', "books");

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                resolve("Book(s) not found");
            }
        };

        req.send();
    });

    document.getElementById("demo").innerHTML = await myBooks;
}

postBooks();

//Retrieve book's info
async function getBooks() {
    let myBooks = new Promise(function(resolve) {
        let req = new XMLHttpRequest();
        req.open('GET', "books");

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                resolve("Book(s) not found");
            }
        };

        req.send();
    });

    document.getElementById("demo").innerHTML = await myBooks;
}

getBooks();

//Retrieving a book by its ISBN
router.get('/books/:ISBN', async(req, res) => {
    const {ISBN} = req.params;
    const book = await books.filter((ISBN) => book.ISBN === ISBN)[0];
    res.json({ok: true, books});
});

//adding author with biography (my imaginary book)
const addingAnAuthorWithBiography = [{
    author: 'Lea Panthers', 
    biography: 'Lea is an author who had written many books. Her books have sold over 200 million copies. She currently lives in Florida and is happy to be a writer.',
    publisher: 'Not Anonymous Writer, Inc.'
}];


async function posBooksWithBiography() {
    let myBooks = new Promise(function(resolve) {
        let req = new XMLHttpRequest();

        req.open('POST', "addingAnAuthorWithBiography");

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                resolve("Book(s) not found");
            }
        };

        req.send();
    });

    document.getElementById("demo").innerHTML = await myBooks;
}

posBooksWithBiography();

 router.get('/', (_, res) => {
   res.send('A Get Call message - Tarah Andre');
 });

 export default  router;


//Citations:
//1. A team member helped me create the branch named book-details.
//2. Ninja, N. (2022, April 14). Complete MongoDB Tutorial. YouTube. https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA
//3. 7. Onejohi. (2018, June 28). Building a simple rest API with nodejs and express. Medium.https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9
//4. A team member helped me so that I could make an additional installation for this repository.
//5. Many team members helped me with my homework.
//6. lennyvita. (2023). I dont understand the basics of async, await and using JSON data to extract the info and apply it. reddit. https://www.reddit.com/r/node/comments/xv1dlm/i_dont_understand_the_basics_of_async_await_and/
//7. Fireship. (n.d.). The Async Await Episode I Promised. YouTube. https://youtu.be/vn3tm0quoqE?si=4y_ic4VJZsDrWvR2 
//8. A Tutor from STARS Tutoring helped me.