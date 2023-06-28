import dotenv from 'dotenv';
import { createServer } from 'http';
import { handleRequest } from './src/requestHandler';

dotenv.config();
const PORT: number = parseInt(process.env.PORT || process.env.RESERVE_PORT || '3000');

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});
