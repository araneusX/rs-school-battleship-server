import { IncomingMessage, ServerResponse } from 'http';

export type Hobby = string;

export type StorageRecord = {
  id: string;
};

export type Method = 'get' | 'post' | 'put' | 'delete';

export type UserData = StorageRecord & {
  username: string;
  age: number;
  hobbies: Hobby[];
};

export type CreateUserData = {
  username: UserData['username'];
  age: UserData['age'];
  hobbies?: UserData['hobbies'];
};

export type UpdateUserData = Partial<CreateUserData>;

export type Storage<T extends StorageRecord> = {
  addItem: (item: Omit<T, 'id'>) => T;
  getAllItems: () => T[];
  getItemById: (id: StorageRecord['id']) => T | null;
  updateItem: (id: StorageRecord['id'], item: Partial<T>) => T;
  deleteItem: (id: StorageRecord['id']) => void;
};

export type Service<T extends StorageRecord> = {
  addItem: (item?: Record<string, unknown> | null) => T;
  getAllItems: () => T[];
  getItemById: (id?: StorageRecord['id'] | null) => T;
  updateItem: (id?: StorageRecord['id'] | null, item?: Record<string, unknown> | null) => T;
  deleteItem: (id?: StorageRecord['id'] | null) => void;
};

export type Controller = {
  handleRoute: (options: { route: string; req: IncomingMessage; res: ServerResponse; method: Method }) => Promise<void>;
};
