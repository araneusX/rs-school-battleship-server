import { Storage as StorageType, StorageRecord } from './types.js';
import { uuid } from '../../utils/uuid.js';

const globalStorage: Record<string, Map<StorageRecord['id'], unknown>> = {};

const checkSubType = <TRecord extends StorageRecord>(base: TRecord, item: Partial<TRecord>) => {
  return Object.keys(item).every((property) => base[property as keyof TRecord] === item[property as keyof TRecord]);
};

export class Storage<TRecord extends StorageRecord> implements StorageType<TRecord> {
  private storage: Map<TRecord['id'], TRecord>;

  constructor({ key }: { key: string }) {
    if (globalStorage[key]) {
      this.storage = globalStorage[key] as Map<TRecord['id'], TRecord>;
    } else {
      this.storage = new Map<TRecord['id'], TRecord>();
      globalStorage[key] = this.storage;
    }
  }

  addItem(item: Omit<TRecord, 'id'>) {
    const id = uuid();
    const data = { ...item, id } as TRecord;
    this.storage.set(id, data);

    return data;
  }

  updateItem(id: TRecord['id'], item: Partial<TRecord>) {
    const data = this.storage.get(id);

    if (!data) {
      throw new Error('Storage/updateItem: Item does not exist');
    }

    const updatedData = { ...data, ...item, id };
    this.storage.set(id, updatedData);

    return updatedData;
  }

  getItemById(id: TRecord['id']) {
    const data = this.storage.get(id);

    return data || null;
  }

  getItemMatch(fields: Partial<TRecord>) {
    if (Object.hasOwn(fields, 'id')) {
      const item = this.getItemById(fields.id as TRecord['id']);

      return item && (checkSubType(item, fields) ? item : null);
    }

    return [...this.storage.values()].find((item) => checkSubType(item, fields)) ?? null;
  }

  findOne(filter: (item: TRecord) => boolean) {
    return [...this.storage.values()].find(filter) ?? null;
  }

  findAll(filter: (item: TRecord) => boolean) {
    return [...this.storage.values()].filter(filter);
  }

  getAllItems() {
    return Array.from(this.storage).map(([_, data]) => data);
  }

  deleteItem(id: TRecord['id']) {
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
