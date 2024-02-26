import WebSocket, { WebSocketServer } from 'ws';
import { SETTINGS } from '../../settings.js';
import { IncomeMessage, SendToClient } from '../../types/index.js';
import { auth } from '../auth/index.js';
import { serialize } from '../../utils/index.js';
import { logger } from '../index.js';
import { createReducer } from '../reducer/root.js';

type Connection = WebSocket & {
  isAlive?: boolean;
  userId?: number;
};

const userConnections = new Map<number, Set<Connection>>();

export const wsServer = new WebSocketServer({ port: SETTINGS.PORT });

const sendToCLient: SendToClient = (message, privacy) => {
  logger.log('Send ', message.type);
  const clients = privacy
    ? privacy
        .filter((userId): userId is number => typeof userId === 'number')
        .flatMap((userId) => [...(userConnections.get(userId) ?? [])])
    : [...wsServer.clients];

  clients.forEach((client) => client.send(serialize(message)));
};

const reducer = createReducer(sendToCLient);

wsServer.on('connection', (socket) => {
  const connection = socket as Connection;
  connection.isAlive = true;

  connection.on('pong', () => {
    connection.isAlive = true;
  });

  connection.on('error', console.error);

  connection.on('close', () => {
    if (connection.userId !== undefined) {
      const userConnectionSet = userConnections.get(connection.userId);
      userConnectionSet?.delete(connection);
    }
  });

  connection.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());

      console.log(message);

      const parsedMessage = {
        type: message.type,
        data: message.data ? JSON.parse(message.data) : null,
      } as IncomeMessage;

      if (parsedMessage.type === 'reg') {
        const userId = (() => {
          try {
            return auth(parsedMessage.data);
          } catch (error) {
            connection.send(
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
        userConnections.set(userId, userConnectionSet);

        connection.userId = userId;

        connection.send(
          serialize({
            type: 'reg',
            data: {
              error: false,
              errorText: '',
              index: 0,
              name: parsedMessage.data.name,
            },
          }),
        );

        reducer([
          {
            type: 'user_joined',
            data: undefined,
            id: userId,
          },
        ]);
      } else if (connection.userId) {
        reducer([
          {
            ...parsedMessage,
            id: connection.userId,
          },
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error:  ', error.message);
      }
    }
  });
});

const interval = setInterval(() => {
  wsServer.clients.forEach((socket) => {
    const connection = socket as Connection;

    if (connection.isAlive === false) {
      //TODO! IMPLEMENT CODE HERE

      if (connection.userId !== undefined) {
        const userConnectionSet = userConnections.get(connection.userId);
        userConnectionSet?.delete(connection);

        reducer([
          {
            type: 'user_left',
            data: undefined,
            id: connection.userId,
          },
        ]);
      }

      return connection.terminate();
    }

    connection.isAlive = false;
    connection.ping();
  });
}, SETTINGS.TIMEOUT);

wsServer.on('close', () => {
  clearInterval(interval);
});

/*

        connection.send(
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

        connection.send(
          serialize({
            type: 'create_game',
            data: {
              idGame: 100,
              idPlayer: 10,
            },
          }),
        );

        connection.send(
          serialize({
            type: 'start_game',
            data: {
              ships: [
                {
                  position: {
                    x: 1,
                    y: 1,
                  },
                  type: 'small',
                  direction: true,
                  length: 1,
                },
              ],
              currentPlayerIndex: 10,
            },
          }),
        );

        connection.send(
          serialize({
            type: 'attack',
            data: {
              currentPlayer: userId,
              position: {
                x: 1,
                y: 1,
              },
              status: 'killed',
            },
          }),
        );

        connection.send(
          serialize({
            type: 'attack',
            data: {
              currentPlayer: userId,
              position: {
                x: 2,
                y: 1,
              },
              status: 'killed',
            },
          }),
        );

        connection.send(
          serialize({
            type: 'attack',
            data: {
              currentPlayer: 10,
              position: {
                x: 1,
                y: 1,
              },
              status: 'killed',
            },
          }),
        );

        connection.send(
          serialize({
            type: 'attack',
            data: {
              currentPlayer: 10,
              position: {
                x: 2,
                y: 1,
              },
              status: 'killed',
            },
          }),
        );

        */
