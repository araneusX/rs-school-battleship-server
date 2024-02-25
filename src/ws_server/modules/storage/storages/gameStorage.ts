import { Game } from '../../../types/general.js';
import { Storage } from '../Storage.js';

export const gameStorage = new Storage<Game>({ key: 'game' });
