import { FieldStatus } from '../../constants/FieldStatus.js';
import { Field, Game, GameEvent, ReducerEvents } from '../../types/index.js';
import { gameStorage, logger } from '../index.js';
import { ScopeReducer } from './types.js';

const createEmptyField = () => new Array(10).fill(null).map(() => new Array(10).fill(FieldStatus.Undefined)) as Field;

const createGame = (users: [number, number]): Omit<Game, 'id'> => ({
  fields: [createEmptyField(), createEmptyField()],
  ships: [],
  users,
  turn: users[Math.round(Math.random())],
});

export const gameReducer: ScopeReducer = (events, { sendToClient }) => {
  const reducerEvents = events as ReducerEvents<GameEvent>;

  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'create_game':
        const newGame = gameStorage.addItem(createGame(event.data.playerIds));

        sendToClient(
          {
            type: 'create_game',
            data: {
              idGame: newGame.id,
              idPlayer: newGame.users[0],
            },
          },
          [newGame.users[0]],
        );

        sendToClient(
          {
            type: 'create_game',
            data: {
              idGame: newGame.id,
              idPlayer: newGame.users[1],
            },
          },
          [newGame.users[1]],
        );

        sendToClient(
          {
            type: 'turn',
            data: {
              currentPlayer: newGame.turn,
            },
          },
          newGame.users,
        );

        break;
      case 'add_ships':
        const { gameId } = event.data;
        const game = gameStorage.getItemById(gameId);

        if (!game) {
          logger.error(`The game with gameId: ${gameId} does not exists`);
          break;
        }

        const playerIndex = game.users.findIndex((id) => id === event.id);

        if (playerIndex === -1) {
          logger.error(`The user with id: ${event.id} is not in game with gameId: ${gameId}`);
          break;
        }

        const gameShips = [...game.ships] as typeof game.ships;
        const gameFields = [...game.fields] as typeof game.fields;

        if (gameShips[playerIndex]) {
          break;
        }

        gameShips[playerIndex] = event.data.ships;

        const field = createEmptyField();

        let isFieldError = false;
        try {
          event.data.ships.forEach(({ position, direction, length }) => {
            for (let offset = 0; offset < length; offset++) {
              const cell = direction
                ? { x: position.x, y: position.y + offset }
                : { x: position.x + offset, y: position.y };

              if (field[cell.x][cell.y] !== FieldStatus.Undefined) {
                isFieldError = true;
              }

              console.log(cell);
              field[cell.x][cell.y] = FieldStatus.Ship;
              console.log(field.map((row) => row.join(' ')).join('\n'));
            }
          });
        } catch (error) {
          console.log(field.map((row) => row.join(' ')).join('\n'));

          throw error;
        }

        if (isFieldError) {
          logger.error('An error has ocurred while fill game field');
          console.log(field.map((row) => row.join(' ')).join('\n'));
          break;
        }

        gameFields[playerIndex] = field;

        const updatedGame = gameStorage.updateItem(gameId, {
          ...game,
          ships: gameShips,
          fields: gameFields,
        });

        if (updatedGame.ships[0] && updatedGame.ships[1]) {
          return {
            type: 'start_game',
            data: {
              gameId: updatedGame.id,
            },
            id: event.id,
          };
        }

        break;
      case 'start_game': {
        const game = gameStorage.getItemById(event.data.gameId);

        if (!game) {
          logger.error(`The game with gameId: ${event.data.gameId} does not exists`);
          break;
        }

        if (!game.ships[0] || !game.ships[1]) {
          logger.error(`The game with gameId: ${event.data.gameId} does not ready to start`);
          break;
        }

        sendToClient(
          {
            type: 'start_game',
            data: {
              currentPlayerIndex: game.users[0],
              ships: game.ships[0],
            },
          },
          [game.users[0]],
        );

        sendToClient(
          {
            type: 'start_game',
            data: {
              currentPlayerIndex: game.users[1],
              ships: game.ships[1],
            },
          },
          [game.users[1]],
        );
        break;
      }
      case 'attack':
        break;
      case 'randomAttack':
        break;

      default:
        break;
    }
  });
};
