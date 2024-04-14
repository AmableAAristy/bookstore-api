// Step 1: Imports
import request from 'supertest';
import express from 'express';
import router from '../routes/profile';

// Import necessary parts for mocking
import { MongoClient } from 'mongodb';

// Step 2: Mock Setup
const mockMongoClient = {
    db: jest.fn().mockReturnThis(),
    collection: jest.fn().mockReturnThis(),
    connect: jest.fn().mockResolvedValue(mockMongoClient),
    close: jest.fn()
};

jest.mock('mongodb', () => ({
    MongoClient: mockMongoClient
}));

// Mock any other modules as necessary
jest.mock('../db', () => ({
  connectToDatabase: () => mockMongoClient.connect()
}));

// Step 3: App Initialization
const app = express();
app.use(express.json());
app.use('/api', router);

// Optional: Additional setup such as setting up the database state
beforeAll(async () => {
  await MongoClient.connect(); // Assuming this is the mocked connect
});

describe('POST /users', () => {
    it('should create a new user and return 201 status', async () => {
      const newUser = {
        username: 'testUser',
        password: 'password',
        realName: 'Test Name',
        email: 'test@example.com',
        address: '123 Test St'
      };
  
      const response = await request(app)
        .post('/users')
        .send(newUser);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      // Add any additional assertions here
    });
  
    it('should return a 400 status if username or password is missing', async () => {
      const newUser = {
        realName: 'Test Name',
      };
  
      const response = await request(app)
        .post('/users')
        .send(newUser);
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      // Add any additional assertions here
    });
  });

  describe('GET /users', () => {
    it('should return a user if the username exists', async () => {
      // Assuming "testUser" exists in your database for testing purposes
      const response = await request(app).get('/users?username=testUser');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('username', 'testUser');
      // Add additional assertions based on the expected properties of foundUser
    });
  
    it('should return 404 if the username does not exist', async () => {
      const response = await request(app).get('/users?username=nonexistentUser');
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Username does not exist');
    });
  });
  
  describe('PATCH /users/:username', () => {
    it('should update user details correctly', async () => {
      const updatedDetails = { password: 'newPassword', realName: 'New Name' };
      const response = await request(app)
        .patch('/users/testUser') // Make sure "testUser" exists in your test database
        .send(updatedDetails);
  
      expect(response.statusCode).toBe(200);
      // Verify that the response body or database reflects the changes
    });
  
    it('should not allow updating the address', async () => {
      const response = await request(app)
        .patch('/users/testUser')
        .send({ address: 'New Address' });
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'You cannot update the address.');
    });
  });
  
  describe('POST /users/:username', () => {
    it('should add a credit card to the user', async () => {
      const creditCardDetails = {
        billingAddress: '123 Test St',
        cardNumber: '1234567890123456',
        expiration: '12/24',
        ccv: '123'
      };
      const response = await request(app)
        .post('/users/testUser') // Ensure "testUser" exists
        .send(creditCardDetails);
  
      expect(response.statusCode).toBe(200);
      // Add assertions to validate the response or database update
    });
  
    it('should return 400 for invalid CVV', async () => {
      const invalidCardDetails = { ccv: 'abc' }; // Invalid CVV
      const response = await request(app)
        .post('/users/testUser')
        .send(invalidCardDetails);
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'CVV most be digits only of length 3 or 4.');
    });
  });
  
