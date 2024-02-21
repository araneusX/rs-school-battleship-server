export type Message<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
};
