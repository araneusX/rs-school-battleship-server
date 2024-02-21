export type AppEvent<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
  userId: number;
};
