import { createHash } from 'crypto';
import { RegEvent } from '../../types/index.js';
import { Storage } from '../index.js';

const users = new Storage<{
  id: number;
  name: string;
  password: string;
}>({ key: 'users' });

export const auth = (data: RegEvent['data']) => {
  const user = users.getItemMatch({ name: data.name });

  const passwordHash = (() => {
    const hash = createHash('sha256');
    hash.update(data.password);
    return hash.digest('hex');
  })();

  if (!user) {
    return users.addItem({
      name: data.name,
      password: passwordHash,
    }).id;
  }

  if (user.password === passwordHash) {
    return user.id;
  }

  throw new Error('Invalid username or password');
};
