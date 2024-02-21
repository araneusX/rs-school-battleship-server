export type Event<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
};
