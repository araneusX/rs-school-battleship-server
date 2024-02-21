import readline from 'readline';
import { Storage } from '../storage/Storage.js';

let isUserInteractionEnabled = false;

if (process.env.LOGGER) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

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
      });
    } catch {}
  }).on('SIGINT', () => {
    rl.close();
    rl.removeAllListeners();
  });
}
const inviteUserToInteraction = () => {
  isUserInteractionEnabled = true;
  console.log('\x1b[36m%s\x1b[0m', 'Press ENTER if you want to print all data from the database.');
};

export const logger = {
  request: ({ method, port, url }: { port: number | string; url?: string; method?: string }) => {
    if (process.env.LOGGER) {
      console.log('\x1b[93m%s\x1b[0m', `${method?.toUpperCase()} REQUEST -> SERVER:${port} | URL: ${url}`);
    }
  },
  success: ({ result }: { result: string }) => {
    if (process.env.LOGGER) {
      console.log('\x1b[92m%s\x1b[0m', result);
      inviteUserToInteraction();
    }
  },
  error: ({ code, message }: { code: string | number; message: string }) => {
    if (process.env.LOGGER) {
      console.log('\x1b[31m%s\x1b[0m', `Operation failed with code ${code}: ${message}`);
      inviteUserToInteraction();
    }
  },
};
