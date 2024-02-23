import { OutcomeMessage } from '../types/index.js';

export const serialize = (event: OutcomeMessage) => {
  const serializedData = JSON.stringify(event.data);

  return JSON.stringify({
    ...event,
    data: serializedData,
    id: 0,
  });
};
