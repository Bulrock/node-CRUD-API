import { ServerResponse } from 'http';

export default function prepareJSONResponse<T>(res: ServerResponse, statusCode: number, data: T) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
