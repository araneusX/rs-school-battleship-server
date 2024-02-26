import { FieldStatus } from '../../../constants/FieldStatus.js';
import { GameEvent, ReducerEvents } from '../../../types/index.js';
import { gameStorage, logger } from '../../index.js';
import { ScopeReducer } from '../types.js';
import { checkFieldDefeated, createEmptyField, createGame, getShipStatus } from './utils.js';

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
        event.data.ships.forEach(({ position, direction, length }) => {
          for (let offset = 0; offset < length; offset++) {
            const cell = direction
              ? { x: position.x, y: position.y + offset }
              : { x: position.x + offset, y: position.y };

            if (field[cell.x][cell.y] !== FieldStatus.Undefined) {
              isFieldError = true;
            }

            field[cell.x][cell.y] = FieldStatus.Ship;
          }
        });

        if (isFieldError) {
          logger.error('An error has ocurred while fill game field');
          break;
        }

        gameFields[playerIndex] = field.map((row) =>
          row.map((status) => (status === FieldStatus.Undefined ? FieldStatus.Empty : status)),
        );

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

        sendToClient(
          {
            type: 'turn',
            data: {
              currentPlayer: game.turn,
            },
          },
          game.users,
        );
        break;
      }
      case 'attack': {
        const { gameId, x, y } = event.data;
        const game = gameStorage.getItemById(gameId);

        if (!game) {
          logger.error(`The game with gameId: ${gameId} does not exists`);
          break;
        }

        if (event.id !== game.turn) {
          break;
        }

        const playerIndex = game.users.findIndex((id) => id === event.id);
        const enemyIndex = Number(!playerIndex);

        const target = game.fields[enemyIndex][x][y];

        const gameFields = [...game.fields] as typeof game.fields;

        console.log({ target, player: event.id, turn: game.turn });

        switch (target) {
          case FieldStatus.Empty: {
            gameFields[enemyIndex][x][y] = FieldStatus.Miss;
            const updatedGame = gameStorage.updateItem(gameId, {
              ...game,
              fields: gameFields,
              turn: game.users[enemyIndex],
            });

            sendToClient(
              {
                type: 'attack',
                data: {
                  position: {
                    x,
                    y,
                  },
                  status: 'miss',
                  currentPlayer: event.id,
                },
              },
              game.users,
            );

            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: updatedGame.turn,
                },
              },
              game.users,
            );

            break;
          }
          case FieldStatus.Ship: {
            const status = getShipStatus(game.fields[enemyIndex], { x, y });

            if (status.killed) {
              status.killCells.forEach((cell) => {
                gameFields[enemyIndex][cell.x][cell.y] = FieldStatus.Kill;

                sendToClient(
                  {
                    type: 'attack',
                    data: {
                      position: {
                        x: cell.x,
                        y: cell.y,
                      },
                      status: 'killed',
                      currentPlayer: event.id,
                    },
                  },
                  game.users,
                );
              });

              status.missCells.forEach((cell) => {
                gameFields[enemyIndex][cell.x][cell.y] = FieldStatus.Miss;

                sendToClient(
                  {
                    type: 'attack',
                    data: {
                      position: {
                        x: cell.x,
                        y: cell.y,
                      },
                      status: 'miss',
                      currentPlayer: event.id,
                    },
                  },
                  game.users,
                );
              });
            } else {
              gameFields[enemyIndex][x][y] = FieldStatus.Shot;

              sendToClient(
                {
                  type: 'attack',
                  data: {
                    position: {
                      x,
                      y,
                    },
                    status: 'shot',
                    currentPlayer: event.id,
                  },
                },
                game.users,
              );
            }
            const updatedGame = gameStorage.updateItem(gameId, {
              ...game,
              fields: gameFields,
            });

            const isWin = !!updatedGame && checkFieldDefeated(updatedGame.fields[enemyIndex]);

            if (isWin) {
              sendToClient({
                type: 'finish',
                data: {
                  winPlayer: event.id,
                },
              });

              return {
                type: 'new_win',
                id: event.id,
              };
            }

            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: event.id,
                },
              },
              [event.id],
            );

            break;
          }
          case FieldStatus.Miss: {
            const updatedGame = gameStorage.updateItem(gameId, {
              ...game,
              turn: game.users[enemyIndex],
            });

            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: updatedGame.turn,
                },
              },
              game.users,
            );

            break;
          }
          case FieldStatus.Kill: {
            sendToClient(
              {
                type: 'attack',
                data: {
                  position: {
                    x,
                    y,
                  },
                  status: 'killed',
                  currentPlayer: event.id,
                },
              },
              game.users,
            );
            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: event.id,
                },
              },
              [event.id],
            );
            break;
          }
          case FieldStatus.Shot: {
            sendToClient(
              {
                type: 'attack',
                data: {
                  position: {
                    x,
                    y,
                  },
                  status: 'shot',
                  currentPlayer: event.id,
                },
              },
              game.users,
            );
            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: event.id,
                },
              },
              [event.id],
            );
            break;
          }
          default:
            sendToClient(
              {
                type: 'turn',
                data: {
                  currentPlayer: event.id,
                },
              },
              [event.id],
            );
            break;
        }
        break;
      }
      case 'randomAttack':
        break;

      default:
        break;
    }
  });
};
