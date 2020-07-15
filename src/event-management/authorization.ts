export type Authorization<TAgent, TEntity> = {
    assertRead: (agent: TAgent, entity: TEntity) => void;
    assertCommand: (agent: TAgent, command: string, entity?: TEntity) => void;
};
