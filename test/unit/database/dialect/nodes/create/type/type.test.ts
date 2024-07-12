import { type } from '@/nodes/create/type/type';

describe('sql > nodes > create > type > type', () => {
  // export function type<T>(typeName: T) {
  //   try {
  //     validation.typeName(typeName);
  //     return `TYPE ${typeName}`;
  //   } catch (error) {
  //     throw new Error(`Could not generate TYPE node for type: [${typeName}]`, {
  //       cause: error
  //     });
  //   }
  // }
  it('should return a string TYPE + validTypeName', () => {
    const validTypeName = 'ValidTypeName';
    expect(type(validTypeName)).toBe(`TYPE ${validTypeName}`);
  });

  it('should error if the typename is invalid', () => {
    const invalidTypename = '   ';
    expect(() => type(invalidTypename)).toThrowErrorMatchingSnapshot();
  });
});
