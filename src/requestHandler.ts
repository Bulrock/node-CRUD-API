import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, createUser } from './services/usersServices';
import prepareJSONResponse from './services/prepareResponse';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;

  if (url === '/api/users' && method === 'GET') {
    getUsers(req, res);
  } else if (url === '/api/users' && method === 'POST') {
    createUser(req, res);
  } else {
    prepareJSONResponse(res, 404, { error: 'Not found' });
  }
}
