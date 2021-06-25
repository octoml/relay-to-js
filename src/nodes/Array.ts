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
    if (test(ret)) return ret;
    throw new Error(visitedTypeMismatch(id, ret.type_key, node.type_key));
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

// TODO: should not be any
export const test = testFactory<Type<any>>(type_key);
export const stest = stestFactory<SType>(type_key);
