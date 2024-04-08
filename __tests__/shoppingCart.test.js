// Author: Brandon Armstrong
import request from 'supertest';
import express from 'express';
import router from '../routes/shoppingCart';
import { connectToDatabase, db } from '../db'; // Import the db module

const app = express();
app.use(express.json());
app.use('/api', router);

// Mock the database connection
jest.mock('../db', () => {
  const originalModule = jest.requireActual('../db');
  return {
    ...originalModule,
    connectToDatabase: jest.fn(),
    db: {
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        updateOne: jest.fn(),
        insertOne: jest.fn(),
        deleteOne: jest.fn(),
      }),
    },
  };
});

// Mock the database connection before all tests
beforeAll(async () => {
  await connectToDatabase(); // Mock database connection
});

// Testing the post method for adding books to shopping cart
describe('POST /api/carts', () => {
  beforeEach(() => {
    db.collection().findOne.mockReset();
    db.collection().updateOne.mockReset();
    db.collection().insertOne.mockReset();
  });

  it('should add a book to the cart successfully', async () => {
    db.collection().findOne.mockResolvedValueOnce(null); // Simulating that the cart does not exist
    db.collection().insertOne.mockResolvedValueOnce({}); // Mock insert operation

    const response = await request(app)
      .post('/api/carts')
      .send({ bookISBN: 'validBookISBN', userId: 'validUserId', bookName: 'BookName', bookAuthor: 'BookAuthor', bookPrice: '10.99' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Cart created successfully, book added!');
  });

  it('should handle missing fields in the request', async () => {
    const response = await request(app)
      .post('/api/carts')
      .send({ userId: 'validUserId', bookName: 'BookName', bookAuthor: 'BookAuthor', bookPrice: '10.99' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Book ISBN, User Id, or Book Price is missing in the request.');
  });

  // Testing adding a book to an existing cart
  it('should add a book to an existing cart successfully', async () => {
    const existingCart = {
      userId: 'validUserId',
      books: [{ bookISBN: 'existingBookISBN', bookPrice: '5.99' }],
      subtotal: 5.99
    };

    db.collection().findOne.mockResolvedValueOnce(existingCart);
    db.collection().updateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    const response = await request(app)
      .post('/api/carts')
      .send({ bookISBN: 'validBookISBN', userId: 'validUserId', bookName: 'BookName', bookAuthor: 'BookAuthor', bookPrice: '10.99' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book added to the cart successfully.');
  });
});

// Testing the delete method for removing books from shopping cart
describe('DELETE /api/carts', () => {
  beforeEach(() => {
    db.collection().findOne.mockReset();
    db.collection().updateOne.mockReset();
    db.collection().deleteOne.mockReset();
  });

  it('should remove a book from the cart successfully', async () => {
    db.collection().findOne
      .mockResolvedValueOnce({ books: [{ bookISBN: 'validBookISBN', bookPrice: '10.99' }, { bookISBN: 'otherBookISBN', bookPrice: '5.99' }] })
      .mockResolvedValueOnce({ books: [{ bookISBN: 'otherBookISBN', bookPrice: '5.99' }], subtotal: 5.99 }); // Remaining book after deletion

    db.collection().updateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    const response = await request(app)
      .delete('/api/carts')
      .send({ bookISBN: 'validBookISBN', userId: 'validUserId' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book removed from the cart successfully.');
  });

  it('should handle cart deletion if all books are removed', async () => {
    db.collection().findOne
      .mockResolvedValueOnce({ books: [{ bookISBN: 'validBookISBN', bookPrice: '10.99' }] }) // Only one book in cart
      .mockResolvedValueOnce(null); // Cart not found after deletion

    db.collection().updateOne.mockResolvedValueOnce({ modifiedCount: 1 });
    db.collection().deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

    const response = await request(app)
      .delete('/api/carts')
      .send({ bookISBN: 'validBookISBN', userId: 'validUserId' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Cart deleted successfully.');
  });
});

// Testing the get method for retrieving the subtotal
describe('GET /api/carts', () => {
  beforeEach(() => {
    db.collection().findOne.mockReset();
  });

  it('should handle missing user ID when retrieving the subtotal', async () => {
    const response = await request(app).get('/api/carts');

    expect(response.status).toBe(404); 
    expect(response.body.error).toBe('Cart not found.'); 
  });

  it('should retrieve a subtotal of 0 for a valid user with an empty cart', async () => {
    const userId = 'validUserId';
    const cart = { userId: userId, subtotal: 0 }; // Mock cart with empty subtotal

    db.collection().findOne.mockResolvedValueOnce(cart);

    const response = await request(app)
      .get(`/api/carts?userId=${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.subtotal).toBe(0);
  });

  it('should handle retrieving the subtotal for an invalid user', async () => {
    const invalidUserId = 'invalidUserId';

    db.collection().findOne.mockResolvedValueOnce(null); // Simulate user not found

    const response = await request(app)
      .get(`/api/carts?userId=${invalidUserId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Cart not found.');
  });

  it('should handle missing user ID when retrieving the subtotal', async () => {
    // the expected behavior should be 'not found' if userId is not provided.
    const response = await request(app).get('/api/carts');

    expect(response.status).toBe(404); 
    expect(response.body.error).toBe('Cart not found.'); 
  });

  it('should handle internal server error during subtotal retrieval', async () => {
    const userId = 'validUserId';

    db.collection().findOne.mockRejectedValueOnce(new Error('Database connection error'));

    const response = await request(app)
      .get(`/api/carts?userId=${userId}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error. Could not retrieve cart.'); 
  });
});