import { FieldStatus } from '../../../constants/FieldStatus.js';
import { Field, Game } from '../../../types/general.js';
import { AddShipEvent } from '../../../types/index.js';

type Position = { x: number; y: number };

const siblings = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const directSiblings = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
];

const xSiblings = [
  [-1, 0],
  [1, 0],
];

const ySiblings = [
  [0, -1],
  [0, 1],
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

export const getRandomAttackPosition = (field: Field) => {
  const shots = field.flatMap((row, x) =>
    row.reduce((acc, cell, y) => (cell === FieldStatus.Shot ? [...acc, { x, y }] : acc), [] as Position[]),
  );

  if (shots.length) {
    const directPositions = shots.flatMap(({ x, y }) =>
      [xSiblings, ySiblings]
        .map((lineSiblings) =>
          lineSiblings.find(([offsetX, offsetY], idx, arr) => {
            const currentX = x + offsetX;
            const currentY = y + offsetY;
            const isRangeX = currentX >= 0 && currentX < 10;
            const isRangeY = currentY >= 0 && currentY < 10;
            const isRange = isRangeX && isRangeY;

            const [oppositeX, oppositeY] = arr[Number(!idx)];

            const currentOppositeX = x + oppositeX;
            const currentOppositeY = y + oppositeY;
            const isRangeOppositeX = currentOppositeX >= 0 && currentOppositeX < 10;
            const isRangeOppositeY = currentOppositeY >= 0 && currentOppositeY < 10;
            const isRangeOpposite = isRangeOppositeX && isRangeOppositeY;

            return (
              isRange &&
              isRangeOpposite &&
              field[currentOppositeX][currentOppositeY] === FieldStatus.Shot &&
              [FieldStatus.Empty, FieldStatus.Ship].includes(field[currentX][currentY])
            );
          }),
        )
        .filter((variant): variant is number[] => !!variant)
        .map(([offsetX, offsetY]) => ({ x: x + offsetX, y: y + offsetY }) as Position),
    );

    if (directPositions.length) {
      return directPositions[Math.floor(Math.random() * directPositions.length)];
    }

    const favoritePositions = shots.flatMap(({ x, y }) =>
      directSiblings
        .filter(([offsetX, offsetY]) => {
          const currentX = x + offsetX;
          const currentY = y + offsetY;
          const isRangeX = currentX >= 0 && currentX < 10;
          const isRangeY = currentY >= 0 && currentY < 10;
          const isRange = isRangeX && isRangeY;

          return isRange && [FieldStatus.Empty, FieldStatus.Ship].includes(field[currentX][currentY]);
        })
        .map(([offsetX, offsetY]) => ({ x: x + offsetX, y: y + offsetY }) as Position),
    );

    if (favoritePositions.length) {
      return favoritePositions[Math.floor(Math.random() * favoritePositions.length)];
    }
  }

  const positions = field.flatMap((row, x) =>
    row.reduce((acc, cell, y) => (cell === FieldStatus.Empty ? [...acc, { x, y }] : acc), [] as Position[]),
  );

  const position = positions[Math.floor(Math.random() * positions.length)] as Position | undefined;

  return position;
};

export const randomIdx = (length: number) => Math.floor(Math.random() * length);

type Ship = AddShipEvent['data']['ships'];

const shipTypes: Ship[number]['type'][] = ['huge', 'large', 'medium', 'small'];

export const createRandomShips = (): Ship => {
  const ships: Ship = [];

  for (let typeIdx = 0; typeIdx < shipTypes.length; typeIdx++) {
    for (let counter = 0; counter < typeIdx + 1; counter++) {
      ships.push({
        type: shipTypes[typeIdx],
        direction: !!Math.round(Math.random()),
        length: shipTypes.length - typeIdx,
        position: {
          x: randomIdx(10),
          y: randomIdx(10),
        },
      });
    }
  }

  let emptyFields = createEmptyField().flatMap((row, x) => row.map((_, y) => `${x}:${y}`));

  const placeShip = (tryFields: string[], ship: AddShipEvent['data']['ships'][number]) => {
    const [x, y] = tryFields[randomIdx(tryFields.length)].split(':').map((value) => Number(value));

    const tryToPlace = () => {
      const currentEmptyFields = new Set(tryFields);
      const { direction, length } = ship;
      for (let offset = 0; offset < length; offset++) {
        const cell = direction ? { x, y: y + offset } : { x: x + offset, y };

        if (!currentEmptyFields.has(`${cell.x}:${cell.y}`)) {
          throw new Error();
        }

        currentEmptyFields.delete(`${cell.x}:${cell.y}`);
      }

      ship.position = { x, y };

      emptyFields = [...currentEmptyFields];
    };

    try {
      tryToPlace();
    } catch {
      try {
        ship.direction = !ship.direction;
        tryToPlace();
      } catch {
        const newFields = tryFields.filter((value) => value !== `${x}:${y}`);
        if (newFields.length) {
          placeShip(newFields, ship);
        } else {
          throw new Error();
        }
      }
    }
  };

  try {
    ships.forEach((ship) => placeShip(emptyFields, ship));
  } catch {
    return createRandomShips();
  }

  return ships;
};
