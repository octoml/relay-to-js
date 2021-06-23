import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from './common';

export type TypeKey = 'SourceName';
export const type_key: TypeKey = 'SourceName';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  repr_str: string;
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  repr_str: string;
};

export function fromtvm({id, nodes, visited}: FromTVMParams): Type {
  const node = nodes[id];
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));

  if (visited[id]) {
    const ret = visited[id];
    if (test(ret)) return ret;
    throw new Error(visitedTypeMismatch(id, ret.type_key, node.type_key));
  }

  return (visited[id] = {id, ...node});
}

export function compare(n1: Type, n2: Type) {
  return n1.repr_str === n2.repr_str;
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
