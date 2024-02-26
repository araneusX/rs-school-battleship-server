import { RoomEvent } from '../../types/events/index.js';
import { ReducerEvents } from '../../types/utils.js';
import { roomStorage, authStorage, logger } from '../index.js';
import { ScopeReducer } from './types.js';

export const roomReducer: ScopeReducer = (events, { sendToClient }) => {
  const reducerEvents = events as ReducerEvents<RoomEvent>;

  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'create_room': {
        const isRoomExists = roomStorage.findOne(({ users }) => users.includes(event.id));

        if (!isRoomExists) {
          const room = roomStorage.addItem({
            users: [event.id],
          });

          logger.created(`User id: ${event.id} created a room with id: ${room.id}`);

          return {
            type: 'cast_room_info',
            data: {
              roomId: room.id,
            },
            id: event.id,
          };
        }
        break;
      }

      case 'add_user_to_room': {
        const {
          id,
          data: { indexRoom },
        } = event;
        const room = roomStorage.getItemById(indexRoom);

        if (!room) {
          logger.error(`The room with id: ${indexRoom} does not exists.`);
          return {
            type: 'cast_room_info',
            id: event.id,
          };
        }

        const [userInRoom] = room.users;

        if (userInRoom !== id) {
          roomStorage.updateItem(indexRoom, {
            ...room,
            users: [userInRoom, id],
          });

          logger.log(`Add second user id: ${id} in the room id: ${event.data.indexRoom}`);

          const usersRoomIds = roomStorage
            .findAll(({ users }) => users.includes(userInRoom) || users.includes(event.id))
            .map(({ id }) => id);

          return [
            {
              type: 'create_game',
              data: {
                playerIds: [userInRoom, id],
              },
              id: event.id,
            },
            {
              type: 'delete_rooms',
              data: {
                roomIds: usersRoomIds,
              },
              id: event.id,
            },
          ];
        }
        break;
      }

      case 'remove_user_from_room': {
        const room = roomStorage.findOne(({ id }) => id === event.id);

        if (room) {
          const users = room.users.filter((userId) => userId !== event.id);

          if (users.length === 0) {
            return {
              type: 'delete_rooms',
              data: {
                roomIds: [room.id],
              },
              id: event.id,
            };
          }

          roomStorage.updateItem(room.id, {
            ...room,
            users: users as [number],
          });
        }

        return {
          type: 'cast_room_info',
          data: {
            roomId: room?.id,
          },
          id: event.id,
        };
      }

      case 'delete_rooms': {
        event.data.roomIds.forEach((roomId) => roomStorage.deleteItem(roomId));

        return {
          type: 'cast_room_info',
          id: event.id,
        };
      }

      case 'cast_room_info':
        {
          const createRoomUsersInfo = (userId: number) => ({
            name: authStorage.getItemById(userId)?.name ?? '',
            index: userId,
          });

          const { roomId, userIds } = event.data ?? {};
          if (roomId) {
            const room = roomStorage.getItemById(roomId);

            if (room) {
              sendToClient(
                {
                  type: 'update_room',
                  data: [
                    {
                      roomId: roomId,
                      roomUsers: room.users.map(createRoomUsersInfo),
                    },
                  ],
                },
                userIds,
              );
            }
          }
          const rooms = roomStorage.getAllItems().map(({ id, users }) => ({
            roomId: id,
            roomUsers: users.map(createRoomUsersInfo),
          }));

          sendToClient(
            {
              type: 'update_room',
              data: rooms,
            },
            userIds,
          );
        }
        break;

      default:
        break;
    }
  });
};
