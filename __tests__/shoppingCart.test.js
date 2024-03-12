//Author: Brandon Armstrong
import request from 'supertest';
import express from 'express';
import router from '../routes/shoppingCart';
import { connectToDatabase, db } from '../db'; // Import the db module

const app = express();
app.use(express.json());
app.use('/api', router);

// Mock the db module outside the test block
jest.mock('../db', () => {
  const originalModule = jest.requireActual('../db');
  return {
    ...originalModule,
    connectToDatabase: jest.fn(),
    db: {
      collection: jest.fn(),
    },
  };
});
//*********************************** */ Mock the database connection ******************************//
beforeAll(async () => {
  
  db.collection.mockImplementation(jest.fn());
  connectToDatabase.mockResolvedValue(db); // Mock the connectToDatabase to return the db object
});
//******************** */Testing the post method for adding books to shopping cart***************//
describe('POST /api/cart/add', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    db.collection.mockReset();
  });

  it('should add a book to the cart successfully', async () => {
    // Mock the behavior of db.collection
    db.collection.mockReturnValueOnce({
      updateOne: jest.fn().mockResolvedValue({}),
    });

    const response = await request(app)
      .post('/api/cart/add')
      .send({ bookId: 'validBookId', userId: 'validUserId' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book added to the cart successfully.');
  });

  it('should handle missing bookId or userId', async () => {
    // Test missing bookId
    let response = await request(app)
      .post('/api/cart/add')
      .send({ userId: 'validUserId' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Book Id or User Id is missing in the request.');

    // Test missing userId
    response = await request(app)
      .post('/api/cart/add')
      .send({ bookId: 'validBookId' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Book Id or User Id is missing in the request.');
  });

  it('should handle error during database update', async () => {
    // Mock the behavior of db.collection to simulate an error during update
    db.collection.mockReturnValueOnce({
      updateOne: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    const response = await request(app)
      .post('/api/cart/add')
      .send({ bookId: 'validBookId', userId: 'validUserId' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error. Please try again later.');
  });
});
//******************** */Testing the delete method for adding books to shopping cart***************//
describe('DELETE /api/cart/delete', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    db.collection.mockReset();
  });

  it('should remove a book from the cart successfully', async () => {
    // Mock the behavior of db.collection for the delete operation
    db.collection.mockReturnValueOnce({
      updateOne: jest.fn().mockResolvedValue({}),
    });

    const response = await request(app)
      .delete('/api/cart/delete')
      .send({ bookId: 'validBookId', userId: 'validUserId' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book removed from the cart successfully.');
  });

  it('should handle missing bookId or userId during delete', async () => {
    // Test missing bookId
    let response = await request(app)
      .delete('/api/cart/delete')
      .send({ userId: 'validUserId' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Book Id or User Id is missing in the request.');

    // Test missing userId
    response = await request(app)
      .delete('/api/cart/delete')
      .send({ bookId: 'validBookId' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Book Id or User Id is missing in the request.');
  });

  it('should handle error during database delete', async () => {
    // Mock the behavior of db.collection to simulate an error during delete
    db.collection.mockReturnValueOnce({
      updateOne: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    const response = await request(app)
      .delete('/api/cart/delete')
      .send({ bookId: 'validBookId', userId: 'validUserId' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error. Please try again later.');
  });
});
