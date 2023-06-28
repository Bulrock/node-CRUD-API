import request from 'supertest';
import * as uuid from 'uuid';

import { handleRequest } from '../src/requestHandler';

let newUserID: string | null;

const correctUser: {
  username: string;
  age: number;
  hobbies: string[];
} = {
  username: 'John',
  age: 1000,
  hobbies: ['Unknown'],
};

const incorrectUser: {
  username: string;
  age: number;
} = {
  username: 'John',
  age: 34,
};

describe('GET requests with empty database', () => {
  test("First GET request to 'api/users' should return empty array with status code 200", async () => {
    const response = await request(handleRequest).get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("GET request to user which doesn't exist should return message with status code 404", async () => {
    const response = await request(handleRequest).get(`/api/users/${uuid.v4()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toEqual('User not found');
  });

  test('GET request to user with using incorrect uuid should return message with status code 400', async () => {
    const response = await request(handleRequest).get('/api/users/notUUID');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid userId');
  });
});

describe('POST requests', () => {
  test('If body contains correct user data, server should return status code 201 and newly created record', async () => {
    const response = await request(handleRequest).post('/api/users').send(correctUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(correctUser.username);
    expect(response.body.age).toBe(correctUser.age);
    expect(response.body.hobbies).toStrictEqual(correctUser.hobbies);

    newUserID = response.body.id;
  });

  test('If body contains incorrect user data, server should return message with status code 400', async () => {
    const response = await request(handleRequest).post('/api/users').send(incorrectUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Username/Age/Hobbies is required');
  });
});

describe('GET requests with not empty database', () => {
  test("Get request to 'api/users' should return array with user which was added in previous tests", async () => {
    const response = await request(handleRequest).get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('GET request to user by uuid, should return this user', async () => {
    const response = await request(handleRequest).get(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(200);
    expect(uuid.validate(response.body.id)).toBe(true);
    expect(response.body.username).toBe(correctUser.username);
    expect(response.body.age).toBe(correctUser.age);
    expect(response.body.hobbies).toStrictEqual(correctUser.hobbies);
  });
});

describe('PUT requests', () => {
  test('If body of PUT request contains correct data and user with uuid in path exists, should return status code 200 and updated record', async () => {
    const updatedUser: {
      id: string | null;
      username: string;
      age: number;
      hobbies: string[];
    } = {
      id: newUserID,
      username: 'John',
      age: 100,
      hobbies: ['Unknown'],
    };

    const response = await request(handleRequest).put(`/api/users/${newUserID}`).send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(newUserID);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(updatedUser.age);
    expect(response.body.hobbies).toStrictEqual(updatedUser.hobbies);
    expect(Object.keys(response.body).length).toBe(4);
  });

  test("PUT request to user which doesn't exist should return message with status code 404", async () => {
    const updatedUser: {
      id: string | null;
      username: string;
      age: number;
      hobbies: string[];
    } = {
      id: newUserID,
      username: 'John',
      age: 100,
      hobbies: ['Unknown'],
    };

    const response = await request(handleRequest).put(`/api/users/${uuid.v4()}`).send(updatedUser);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  test('PUT request to user with using incorrect uuid should return message with status code 400', async () => {
    const updatedUser: {
      id: string | null;
      username: string;
      age: number;
      hobbies: string[];
    } = {
      id: newUserID,
      username: 'John',
      age: 100,
      hobbies: ['Unknown'],
    };

    const response = await request(handleRequest).put('/api/users/notUUID').send(updatedUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid userId');
  });
});

describe('DELETE requests', () => {
  test('If user with uuid from path exist should remove this user and return status code 204', async () => {
    const response = await request(handleRequest).delete(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(204);
  });

  test("DELETE request to user which doesn't exist should return message with status code 404", async () => {
    const response = await request(handleRequest).delete(`/api/users/${newUserID}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  test('DELETE request to user with using incorrect uuid should return message with status code 400', async () => {
    const response = await request(handleRequest).delete('/api/users/notUUID');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid userId');
  });
});

describe('Wrong path request', () => {
  test('GET request to wrong path should return message with status code 404', async () => {
    const response = await request(handleRequest).get('/api/notusers');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Not found');
  });

  test('POST request to wrong path should return message with status code 404', async () => {
    const response = await request(handleRequest).post('/api/users/something/');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Not found');
  });

  test('PUT request to wrong path should return message with status code 404', async () => {
    const response = await request(handleRequest).put('/api/notusers/something/');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Not found');
  });

  test('DELETE request to wrong path should return message with status code 404', async () => {
    const response = await request(handleRequest).delete('/api/notusers/something/');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Not found');
  });
});

describe('Requests with using wrong method', () => {
  test('Request with using not supported PATCH method should return message with status code 501', async () => {
    const response = await request(handleRequest).patch('/api/users/something/');

    expect(response.statusCode).toBe(501);
    expect(response.body.error).toBe('Server supports only: GET, POST, PUT or DELETE methods');
  });
});
