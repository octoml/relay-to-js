import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {relay, SpanNode} from '../';

export type TypeKey = 'relay.Constant';
export const type_key: TypeKey = 'relay.Constant';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    // should this be Type not TensorType?
    _checked_type_: relay.TensorTypeNode.Type;
    data: string;
    span?: SpanNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    _checked_type_: string;
    data: string;
    span: string;
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

  const {_checked_type_, data, span} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      _checked_type_: relay.TensorTypeNode.fromtvm({
        id: +_checked_type_,
        nodes,
        visited,
      }),
      data,
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
