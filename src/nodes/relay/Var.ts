import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {relay, SpanNode, TypeNode} from '../';

export type TypeKey = 'relay.Var';
export const type_key: TypeKey = 'relay.Var';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    span?: SpanNode.Type;
    type_annotation: TypeNode.Type;
    vid: relay.IdNode.Type;
    _checked_type_: TypeNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    span: string;
    type_annotation: string;
    vid: string;
    _checked_type_: string;
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

  const {span, type_annotation, vid, _checked_type_} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      type_annotation: TypeNode.fromtvm({
        id: +type_annotation,
        nodes,
        visited,
      }),
      vid: relay.IdNode.fromtvm({id: +vid, nodes, visited}),
      _checked_type_: TypeNode.fromtvm({id: +_checked_type_, nodes, visited}),
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
