import { Room } from '../../../types/index.js';
import { Storage } from '../Storage.js';

export const roomStorage = new Storage<Room>({ key: 'room' });
