import readline from 'readline';
import { Storage } from '../storage/Storage.js';
import { Game } from '../../types/general.js';

let isUserInteractionEnabled = false;

const inviteUserToInteraction = () => {
  isUserInteractionEnabled = true;
  console.log('\x1b[36m%s\x1b[0m', 'Press ENTER if you want to print all data from the database.');
};

if (process.env.LOGGER) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  inviteUserToInteraction();

  rl.on('line', () => {
    try {
      if (!isUserInteractionEnabled) {
        return;
      }

      isUserInteractionEnabled = false;

      const data = Storage.getStorageData();
      Object.entries(data).forEach(([key, items]) => {
        console.log('\x1b[36m%s\x1b[0m', key.toUpperCase(), ':');

        if (!items.length) {
          console.log('\x1b[36m%s\x1b[0m', '    [No data saved in this table.]');
          return;
        }

        if (key === 'game') {
          (items as Game[]).forEach((item) => {
            console.log('ID =', item.id);
            console.log('');
            console.log('TURN: id =', item.turn);
            console.log('');
            console.log('PLAYER1: id =', item.users[0]);
            console.log(item.fields[0].map((row) => row.join(' ')).join('\n'));
            console.log('');
            console.log('PLAYER2: id =', item.users[1]);
            console.log(item.fields[1].map((row) => row.join(' ')).join('\n'));
          });

          return;
        }

        console.table(
          items.map((item) => {
            if (item && typeof item === 'object' && 'id' in item) {
              const { id, ...itemData } = item;
              return {
                id,
                ...Object.fromEntries(
                  Object.entries(itemData).map(([key, data]) => [
                    key,
                    data && typeof data === 'object' ? JSON.stringify(data) : data,
                  ]),
                ),
              };
            }

            return item;
          }),
        );

        console.log('');
      });
    } catch {}
  }).on('SIGINT', () => {
    rl.close();
    rl.removeAllListeners();
  });
}

export const logger = {
  log: (...messages: string[]) => {
    if (process.env.LOGGER) {
      console.log(...messages);
      inviteUserToInteraction();
    }
  },
  created: (...messages: string[]) => {
    if (process.env.LOGGER) {
      console.log('\x1b[92m%s\x1b[0m', ...messages);
      inviteUserToInteraction();
    }
  },
  error: (...messages: string[]) => {
    if (process.env.LOGGER) {
      console.log('\x1b[31m%s\x1b[0m', ...messages);
      inviteUserToInteraction();
    }
  },
};
