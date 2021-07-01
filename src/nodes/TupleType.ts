import {
  testFactory,
  typeMismatch,
  FromTVMParams,
  visitedTypeMismatch,
  stestFactory,
  BaseType,
} from './common';
import {ArrayNode, SpanNode, TypeNode} from './';

export type TypeKey = 'TupleType';
export const type_key: TypeKey = 'TupleType';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    fields: ArrayNode.Type<TypeNode.Type>;
    span?: SpanNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    fields: string;
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

  const {fields, span} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      fields: ArrayNode.fromtvm<TypeNode.Type>({
        id: +fields,
        nodes,
        visited,
        _test: TypeNode.test,
      }),
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
    },
  });
}

export function compare(n1: Type, n2: Type) {
  const d1 = n1.attrs.fields.data;
  const d2 = n2.attrs.fields.data;
  if (typeof d1 !== typeof d2) return false;
  if (!d1 && !d2) return true;
  if (d1.length !== d2.length) return false;
  for (let i = 0; i < d1.length; i++) {
    if (!TypeNode.compare(d1[i], d2[i])) return false;
  }
  return true;
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
