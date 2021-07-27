import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../../common';
import {ArrayNode, IntImmNode} from '../..';

export type TypeKey = 'relay.attrs.ClipAttrs';
export const type_key: TypeKey = 'relay.attrs.ClipAttrs';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    a_max: number;
    a_min: number;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    a_max: string;
    a_min: string;
  };
};

export function fromtvm({id, nodes, visited}: FromTVMParams): Type {
  const node = nodes[id];
  if (node.type_key === '') return null;
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));

  if (visited[id]) {
    const ret = visited[id];
    if (test(ret)) return ret;
    throw new Error(visitedTypeMismatch(id, ret.type_key, node.type_key));
  }

  const {a_max, a_min} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      a_max: +a_max,
      a_min: +a_min,
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
