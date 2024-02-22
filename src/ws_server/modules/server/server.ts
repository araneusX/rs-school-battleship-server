import WebSocket from 'ws';
import { uuid } from '../../utils/uuid.js';
import { SETTINGS } from '../../settings.js';
import { IncomeMessage, BaseMessage } from '../../types/index.js';

type Connections = Map<number, { userId: number; connectionId: number }[]>;

type Users = Map<number, { userId: number; connectionId: number }>;

type Connection = WebSocket & {
  id?: number;
  isAlive?: boolean;
};

export const server = new WebSocket.Server({ port: SETTINGS.PORT });

server.on('connection', (socket) => {
  const connection = socket as Connection;
  connection.id = uuid();
  connection.isAlive = true;

  connection.on('pong', () => {
    connection.isAlive = true;
  });

  connection.on('error', console.error);

  connection.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());

      const parsedMessage = {
        type: message.type,
        data: JSON.parse(message.data),
      } as IncomeMessage;
    } catch (error) {
      console.error(error);
    }
  });
});

const interval = setInterval(() => {
  server.clients.forEach((socket) => {
    const connection = socket as Connection;

    if (connection.isAlive === false) {
      //TODO! IMPLEMENT CODE HERE
      return connection.terminate();
    }

    connection.isAlive = false;
    connection.ping();
  });
}, SETTINGS.TIMEOUT);

server.on('close', () => {
  clearInterval(interval);
});
