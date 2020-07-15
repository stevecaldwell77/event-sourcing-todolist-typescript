import { StructType, enums } from 'superstruct';

export type AgentRole = StructType<typeof AgentRole>;
export const AgentRole = enums(['ADMIN']);
