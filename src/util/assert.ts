import { Type } from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

export const assertSchema = <K>(schema: Type<K>) => (
    input: unknown,
): asserts input is K => {
    const validation = schema.decode(input);
    if (isRight(validation)) return;
    throw new Error(PathReporter.report(validation).join('\n'));
};
