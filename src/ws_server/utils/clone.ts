export const clone = <T>(value: T): T => {
  if (value && typeof value === 'object') {
    return JSON.parse(JSON.stringify(value));
  }

  return value;
};
