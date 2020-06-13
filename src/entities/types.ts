export type MapToEntity<T> = {
    (input: unknown): T;
};

export interface HasRevision {
    revision: number;
}
