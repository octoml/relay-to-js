import {
  BaseType,
  DType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {ArrayNode, IntImmNode, SpanNode} from '../';

export type TypeKey = 'relay.TensorType';
export const type_key: TypeKey = 'relay.TensorType';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    dtype: DType;
    shape: ArrayNode.Type<IntImmNode.Type>;
    span?: SpanNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    dtype: DType;
    shape: string;
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

  const {dtype, shape, span} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      dtype,
      shape: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +shape,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
    },
  });
}

export function compare(n1: Type, n2: Type) {
  if (n1.attrs.dtype !== n2.attrs.dtype) return false;
  const d1 = n1.attrs.shape.data;
  const d2 = n2.attrs.shape.data;
  if (typeof d1 !== typeof d2) return false;
  if (!d1 && !d2) return true;
  if (d1.length !== d2.length) return false;
  for (let i = 0; i < d1.length; i++) {
    if (d1[i].attrs.dtype !== d2[i].attrs.dtype) return false;
    if (d1[i].attrs.value !== d2[i].attrs.value) return false;
  }
  return true;
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
