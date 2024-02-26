import { createHash } from 'crypto';
import { RegEvent } from '../../types/index.js';
import { authStorage, logger } from '../index.js';

export const auth = (data: RegEvent['data']) => {
  const user = authStorage.getItemMatch({ name: data.name });

  const passwordHash = (() => {
    const hash = createHash('sha256');
    hash.update(data.password);
    return hash.digest('hex');
  })();

  if (!user) {
    const newUserId = authStorage.addItem({
      name: data.name,
      password: passwordHash,
    }).id;

    logger.created(`Created an user with id: ${newUserId}.`);

    return newUserId;
  }

  if (user.password === passwordHash) {
    logger.log(`User id: ${user.id} logged in.`);
    return user.id;
  }

  throw new Error('Invalid username or password');
};
