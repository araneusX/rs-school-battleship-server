import { Winner } from '../../../types/index.js';
import { Storage } from '../Storage.js';

export const winnersStorage = new Storage<Winner>({ key: 'winners' });
