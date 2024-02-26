import { Storage } from '../Storage.js';

export const authStorage = new Storage<{
  id: number;
  name: string;
  password: string;
}>({ key: 'auth' });
