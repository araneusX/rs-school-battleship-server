import { OutcomeMessage } from './index.js';

export type SendToClient = (message: OutcomeMessage, privacy?: number[]) => void;
