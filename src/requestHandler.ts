import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUser, createUser, updateUser, deleteUser } from './services/usersServices';
import prepareJSONResponse from './services/prepareResponse';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;

  if (url === '/api/users' && method === 'GET') {
    getUsers(req, res);
  } else if (url && url.startsWith('/api/users/') && method === 'GET') {
    const userId = url.split('/')[3];
    getUser(req, res, userId);
  } else if (url === '/api/users' && method === 'POST') {
    createUser(req, res);
  } else if (url && url.startsWith('/api/users/') && method === 'PUT') {
    const userId = url.split('/')[3];
    updateUser(req, res, userId);
  } else if (url && url.startsWith('/api/users/') && method === 'DELETE') {
    const userId = url.split('/')[3];
    deleteUser(req, res, userId);
  } else if (
    url &&
    method !== 'GET' &&
    method !== 'POST' &&
    method !== 'PUT' &&
    method !== 'DELETE'
  ) {
    prepareJSONResponse(res, 501, {
      error: 'Server supports only: GET, POST, PUT or DELETE methods',
    });
  } else {
    prepareJSONResponse(res, 404, { error: 'Not found' });
  }
}
