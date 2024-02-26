import { FieldStatus } from '../../../constants/FieldStatus.js';
import { Field, Game } from '../../../types/general.js';

type Position = { x: number; y: number };

const siblings = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export const createEmptyField = () =>
  new Array(10).fill(null).map(() => new Array(10).fill(FieldStatus.Undefined)) as Field;

export const createGame = (users: [number, number]): Omit<Game, 'id'> => ({
  fields: [createEmptyField(), createEmptyField()],
  ships: [],
  users,
  turn: users[Math.round(Math.random())],
});

export const getShipStatus = (field: Field, cell: Position) => {
  const missCells = new Set<string>();
  const handledCells = new Set<string>();
  const nextCells = new Set<string>();
  let isAlive = false;

  const handleCell = (currentCell: Position): { killed: boolean; missCells: Position[]; killCells: Position[] } => {
    handledCells.add(`${currentCell.x}:${currentCell.y}`);
    nextCells.delete(`${currentCell.x}:${currentCell.y}`);

    siblings.forEach(([offsetX, offsetY]) => {
      const currentX = currentCell.x + offsetX;
      const currentY = currentCell.y + offsetY;

      const isRangeX = currentX >= 0 && currentX < 10;
      const isRangeY = currentY >= 0 && currentY < 10;
      const isRange = isRangeX && isRangeY;

      if (!isRange || handledCells.has(`${currentX}:${currentY}`)) {
        return;
      }

      switch (field[currentX][currentY]) {
        case FieldStatus.Empty:
          missCells.add(`${currentX}:${currentY}`);
          break;
        case FieldStatus.Ship:
          isAlive = true;
          break;
        case FieldStatus.Shot:
          nextCells.add(`${currentX}:${currentY}`);
        default:
          break;
      }
    });

    if (isAlive) {
      return {
        killed: false,
        missCells: [],
        killCells: [],
      };
    }

    if (nextCells.size) {
      const [x, y] = [...nextCells][0].split(':');
      return handleCell({
        x: Number(x),
        y: Number(y),
      });
    }

    const missCellsArr = [...missCells].map((position) => {
      const [x, y] = position.split(':');

      return {
        x: Number(x),
        y: Number(y),
      };
    });

    const killCellsArr = [...handledCells].map((position) => {
      const [x, y] = position.split(':');

      return {
        x: Number(x),
        y: Number(y),
      };
    });

    return {
      killed: true,
      missCells: missCellsArr,
      killCells: killCellsArr,
    };
  };

  return handleCell(cell);
};

export const checkFieldDefeated = (field: Field) => !field.some((row) => row.some((cell) => cell === FieldStatus.Ship));
