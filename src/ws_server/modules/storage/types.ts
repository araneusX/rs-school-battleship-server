export type StorageRecord = {
  id: number;
};

export type Storage<T extends StorageRecord> = {
  addItem: (item: Omit<T, 'id'>) => T;
  getAllItems: () => T[];
  getItemById: (id: StorageRecord['id']) => T | null;
  updateItem: (id: StorageRecord['id'], item: Partial<T>) => T;
  deleteItem: (id: StorageRecord['id']) => void;
};
