import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {runtime} from '../';

export type TypeKey = 'relay.Id';
export const type_key: TypeKey = 'relay.Id';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {name_hint: runtime.StringNode.Type};
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {name_hint: string};
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

  const {name_hint} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      name_hint: runtime.StringNode.fromtvm({id: +name_hint, nodes, visited}),
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
