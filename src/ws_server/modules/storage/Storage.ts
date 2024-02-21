import { v4 as uuid } from 'uuid';
import { Storage as StorageType, StorageRecord } from '../../types.js';
import { InternalError } from '../index.js';
import { InternalErrorCodes, InternalErrorMessages } from '../../constants/index.js';

const globalStorage: Record<string, Map<string, unknown>> = {};

export abstract class Storage<TRecord extends StorageRecord> implements StorageType<TRecord> {
  private storage: Map<string, TRecord>;

  constructor({ key }: { key: string }) {
    if (globalStorage[key]) {
      this.storage = globalStorage[key] as Map<string, TRecord>;
    } else {
      this.storage = new Map<string, TRecord>();
      globalStorage[key] = this.storage;
    }
  }

  addItem(item: Omit<TRecord, 'id'>) {
    const id = uuid();
    const data = { ...item, id } as TRecord;
    this.storage.set(id, data);

    return data;
  }

  updateItem(id: string, item: Partial<TRecord>) {
    const data = this.storage.get(id);

    if (!data) {
      throw new InternalError({ message: InternalErrorMessages.UserNotExist, code: InternalErrorCodes.ItemNotExist });
    }

    const updatedData = { ...data, ...item, id };
    this.storage.set(id, updatedData);

    return updatedData;
  }

  getItemById(id: string) {
    const data = this.storage.get(id);

    return data || null;
  }

  getAllItems() {
    return Array.from(this.storage).map(([_, data]) => data);
  }

  deleteItem(id: string) {
    this.storage.delete(id);
  }

  static getStorageData() {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(globalStorage).map(([key, valuesMap]) => [key, Array.from(valuesMap).map(([_, data]) => data)]),
      ),
    );
  }

  static cleanStorageData() {
    Object.keys(globalStorage).forEach((key) => globalStorage[key].clear());
  }
}
