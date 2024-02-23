import WebSocket from 'ws';
import { SETTINGS } from '../../settings.js';
import { IncomeMessage, BaseMessage } from '../../types/index.js';
import { auth } from '../auth/index.js';
import { serialize } from '../../utils/index.js';
import { logger } from '../index.js';

type Connection = WebSocket & {
  isAlive?: boolean;
};

const userConnections = new Map<number, Set<Connection>>();

export const wsServer = new WebSocket.Server({ port: SETTINGS.PORT });

wsServer.on('connection', (socket) => {
  const connection = socket as Connection;
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

      if (parsedMessage.type === 'reg') {
        const userId = (() => {
          try {
            return auth(parsedMessage.data);
          } catch (error) {
            connection.emit(
              'message',
              serialize({
                type: 'reg',
                data: {
                  error: true,
                  errorText: error instanceof Error ? error.message : 'An error has occurred',
                  index: 0,
                  name: parsedMessage.data.name,
                },
              }),
            );

            throw error;
          }
        })();

        const userConnectionSet = userConnections.get(userId) ?? new Set();
        userConnectionSet.add(connection);
        userConnections.set(userId, new Set());

        connection.emit(
          'message',
          serialize({
            type: 'reg',
            data: {
              error: false,
              errorText: '',
              index: userId,
              name: parsedMessage.data.name,
            },
          }),
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }
  });
});

const interval = setInterval(() => {
  console.log(userConnections);

  wsServer.clients.forEach((socket) => {
    const connection = socket as Connection;

    if (connection.isAlive === false) {
      //TODO! IMPLEMENT CODE HERE
      return connection.terminate();
    }

    connection.isAlive = false;
    connection.ping();
  });
}, SETTINGS.TIMEOUT);

wsServer.on('close', () => {
  clearInterval(interval);
});
