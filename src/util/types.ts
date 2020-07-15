import { StructType, Struct, assert } from 'superstruct';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assertType = <TStruct extends Struct<any>>(struct: TStruct) => (
    v: unknown,
): asserts v is StructType<TStruct> => assert(v, struct);
