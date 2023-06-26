import { db } from '../database';
import { v4 } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import prepareJSONResponse from './prepareResponse';
import { validateUserFields, validateUserId } from './validators';

export function createUser(req: IncomingMessage, res: ServerResponse) {
  const chunks: Uint8Array[] = [];
  req
    .on('data', (chunk) => {
      chunks.push(chunk);
    })
    .on('end', () => {
      const data = Buffer.concat(chunks).toString();
      const userData = JSON.parse(data);

      const validationError = validateUserFields(userData);
      if (validationError) {
        prepareJSONResponse(res, 400, { error: validationError });
        return;
      }

      const id = v4();
      const newUser = {
        id,
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies || [],
      };

      db[id] = newUser;
      prepareJSONResponse(res, 201, newUser);
    });
}

export function getUsers(req: IncomingMessage, res: ServerResponse) {
  prepareJSONResponse(res, 200, Object.values(db));
}

export function getUser(req: IncomingMessage, res: ServerResponse, userId: string) {
  if (!validateUserId(userId)) {
    prepareJSONResponse(res, 400, { error: 'Invalid userId' });
    return;
  }

  const user = db[userId];
  if (user) {
    prepareJSONResponse(res, 200, user);
  } else {
    prepareJSONResponse(res, 404, { error: 'User not found' });
  }
}

export function updateUser(req: IncomingMessage, res: ServerResponse, userId: string) {
  if (!validateUserId(userId)) {
    prepareJSONResponse(res, 400, { error: 'Invalid userId' });
    return;
  }

  const user = db[userId];
  if (user) {
    const chunks: Uint8Array[] = [];
    req
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        const data = Buffer.concat(chunks).toString();
        const userData = JSON.parse(data);

        const validationError = validateUserFields(userData);
        if (validationError) {
          prepareJSONResponse(res, 400, { error: validationError });
          return;
        }

        user.username = userData.username;
        user.age = userData.age;
        user.hobbies = userData.hobbies || [];

        prepareJSONResponse(res, 200, user);
      });
  } else {
    prepareJSONResponse(res, 404, { error: 'User not found' });
  }
}
