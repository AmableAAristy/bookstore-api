//Author: Amable Aristy
import request from 'supertest';
import express from 'express';
import router from '../routes/profile';
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
beforeEach(() => {
    // Reset mocks before each test
    db.collection.mockReset();
  });
  
  // Test for successfully adding a user
  it('should add a user profile successfully', async () => {
    // Mock findOne to simulate checking for an existing username
    db.collection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null), // No existing user found
      insertOne: jest.fn().mockResolvedValue({ insertedId: '123456' }) // Simulate successful insert
    });
  
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'validUsername', password: 'validPassword', realName: 'John Doe', email: 'john@example.com', address: '1234 Street' });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.insertedId).toBeDefined();
  });
  
  // Test for username already exists
  it('should fail when username is already taken', async () => {
    db.collection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ username: 'validUsername' }) // Username exists
    });
  
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'validUsername', password: 'validPassword' });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Unique username already taken');
  });
  
  // Test for missing username or password
  it('should fail when username or password are missing', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'validUsername' }); // Password is missing
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password are required!');
  });

//*********************************MOCK THE GET ******************************* */

beforeEach(() => {
    db.collection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),  // Default to not found; override in specific tests
    });
  });
  
  it('should return 200 and the user data if the user is found', async () => {
    const mockUser = { username: 'johndoe', password: 'ABC123' };
    db.collection.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockUser)
    });
  
    const response = await request(app)
      .get('/api/users')
      .query({ username: 'johndoe' });
    

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should return 404 if the username does not exist', async () => {
    const response = await request(app)
      .get('/api/users')
      .query({ username: 'unknownuser' });
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Username does not exist");
  });

  
//******************************************MOCK THE PATCH****************************** */
// Mock db.collection to be reused in each test
beforeEach(() => {
    db.collection.mockReturnValue({     
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 0 })  // Default to no modifications; override in specific tests
    });
  });

  it('should return 400 if trying to update the address', async () => {
    const response = await request(app)
      .patch('/api/users/johndoe')
      .send({ address: '123 New St' });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("You cannot update the address.");
  });

  it('should update user data successfully', async () => {
    db.collection.mockReturnValue({
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
    });
  
    const response = await request(app)
      .patch('/api/users/johndoe')
      .send({ email: 'john@update.com' });
  
    expect(response.status).toBe(200);
    expect(response.body.result).toBeDefined();
  });
  it('should return 400 if no data was updated', async () => {
    const response = await request(app)
      .patch('/api/users/johndoe')
      .send({ realName: 'John Updated' }); // Assume the realName is already 'John Updated'
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No data was updated");
  });

  // ********************credit card post  mock*********************//
  beforeEach(() => {
    db.collection.mockReturnValue({     
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 0 })  // Default to no modifications; override in specific tests
    });
  });

  it('should return 400 if the CVV is invalid', async () => {
    const response = await request(app)
      .post('/api/users/johndoe')
      .send({
        billingAddress: '123 Elm St',
        cardNumber: '1234567890123456',
        expiration: '12/24',
        cvv: '12a'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("CVV must be digits only of length 3 or 4.");
  });
  it('should return 400 if user is not found', async () => {
    db.collection().findOne.mockResolvedValue(null);
  
    const response = await request(app)
      .post('/api/users/johndoe')
      .send({
        billingAddress: '123 Elm St',
        cardNumber: '1234567890123456',
        expiration: '12/24',
        cvv: '123'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("User not found.");
  });

  it('should handle database errors gracefully', async () => {
    db.collection().findOne.mockResolvedValue({ username: 'johndoe' });
    db.collection().updateOne.mockRejectedValue(new Error("DB error"));
  
    const response = await request(app)
      .post('/api/users/johndoe')
      .send({
        billingAddress: '123 Elm St',
        cardNumber: '1234567890123456',
        expiration: '12/24',
        cvv: '123'
      });
  
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("A server error occurred.");
  });
  
    
