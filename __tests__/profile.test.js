// Author: Amable Aristy
import request from 'supertest';
import express from 'express';
import router from '../routes/profile';
import { connectToDatabase, db } from '../db';

const app = express();
app.use(express.json());
app.use('/api', router);

// Connect to MongoDB before running tests
beforeAll(async () => {
   await connectToDatabase();
});

// Close MongoDB connection after running tests
afterAll(async () => {
  await db.client.close();
});

// Test cases using the real database
describe('Profile API Tests', () => {
  // Test for successfully adding a user
  it('should add a user profile successfully', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'validUsername', password: 'validPassword', realName: 'John Doe', email: 'john@example.com', address: '1234 Street' });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.insertedId).toBeDefined();
  });

  // Test for username already exists
  it('should fail when username is already taken', async () => {
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

  // Test for retrieving user data
  it('should return 200 and the user data if the user is found', async () => {
    const response = await request(app)
      .get('/api/users')
      .query({ username: 'validUsername' });
  
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('validUsername');
  });

  // Test for updating user data
  it('should update user data successfully', async () => {
    const response = await request(app)
      .patch('/api/users/validUsername')
      .send({ email: 'john@update.com' });
  
    expect(response.status).toBe(200);
    expect(response.body.result).toBeDefined();
  });

  // Test for credit card information
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
    expect(response.body.error).toBe("CVV most be digits only of length 3 or 4.");
  });

});
