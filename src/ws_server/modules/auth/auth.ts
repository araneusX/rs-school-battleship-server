import { createHash } from 'crypto';
import { RegEvent } from '../../types/index.js';
import { authStorage } from '../index.js';

export const auth = (data: RegEvent['data']) => {
  const user = authStorage.getItemMatch({ name: data.name });

  const passwordHash = (() => {
    const hash = createHash('sha256');
    hash.update(data.password);
    return hash.digest('hex');
  })();

  if (!user) {
    return authStorage.addItem({
      name: data.name,
      password: passwordHash,
    }).id;
  }

  if (user.password === passwordHash) {
    return user.id;
  }

  throw new Error('Invalid username or password');
};
