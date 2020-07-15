export type AssertType<T> = {
    (v: unknown): asserts v is T;
};

export const assertUnknownEvent = (event: never): never => {
    throw new Error(`Unexpected event found: ${JSON.stringify(event)}`);
};
