import { Type } from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

export const mapOrDie = <T>(schema: Type<T>) => (input: unknown): T => {
    const validation = schema.decode(input);
    if (isRight(validation)) return validation.right;
    throw new Error(PathReporter.report(validation).join('\n'));
};
