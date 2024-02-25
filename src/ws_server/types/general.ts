import { FieldStatus } from '../constants/FieldStatus.js';
import { OutcomeMessage } from './index.js';

export type SendToClient = (message: OutcomeMessage, privacy?: (number | null | undefined)[] | null) => void;

export type Room = {
  id: number;
  users: [userId: number] | [userId: number, userId: number];
};

export type Field = FieldStatus[][];

export type Ships = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}[];

export type Game = {
  id: number;
  users: [id: number, id: number];
  ships: [ships?: Ships, ships?: Ships];
  fields: [field: Field, field: Field];
};
