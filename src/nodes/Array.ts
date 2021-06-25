import {
  BaseType,
  FromTVMParams,
  GType,
  stestFactory,
  Test,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from './common';
import {GenericNode} from './';

export type TypeKey = 'Array';
export const type_key: TypeKey = 'Array';

export type Type<N extends GType> = BaseType & {
  type_key: TypeKey;
  data?: N[];
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  data?: number[];
};

export function fromtvm<N extends GType>({
  id,
  nodes,
  visited,
  _test,
}: FromTVMParams & {
  _test?: Test<N>;
}): Type<N> {
  const node = nodes[id];
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));
  if (!_test) throw new Error('Array.fromtvm requires _test');

  if (visited[id]) {
    const ret = visited[id];
    if (testWithTypeFactory(_test)(ret)) return ret;
    throw new Error(
      visitedTypeMismatch(
        id,
        ret.type_key,
        node.type_key + `<${_test.type.join('|')}>`,
      ),
    );
  }

  return (visited[id] = {
    id,
    type_key,
    ...('data' in node
      ? {
          data: node.data.map(datum => {
            const ret = GenericNode.fromtvm({id: datum, nodes, visited});
            if (!_test(ret)) {
              throw new Error(
                typeMismatch(_test.type.join(' or '), nodes[datum].type_key),
              );
            }
            return ret;
          }),
        }
      : {}),
  });
}

export const test = testFactory<Type<GType>>(type_key);
export const stest = stestFactory<SType>(type_key);

export function testWithTypeFactory<T extends GType>(
  t: Test<T>,
): Test<Type<T>> {
  return Object.assign(
    (node: GType): node is Type<T> => test(node) && (node.data ?? []).every(t),
    {type: [`${type_key}<${t.type.join('|')}>`]},
  );
}
