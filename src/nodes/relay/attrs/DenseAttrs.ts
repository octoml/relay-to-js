import {
  BaseType,
  DType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../../common';
import {IntImmNode} from '../../';

export type TypeKey = 'relay.attrs.DenseAttrs';
export const type_key: TypeKey = 'relay.attrs.DenseAttrs';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    out_dtype: DType;
    units: IntImmNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    out_dtype: DType;
    units: string;
  };
};

export function fromtvm({id, nodes, visited}: FromTVMParams): Type {
  const node = nodes[id];
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));

  if (visited[id]) {
    const ret = visited[id];
    if (test(ret)) return ret;
    throw new Error(visitedTypeMismatch(id, ret.type_key, node.type_key));
  }

  const {out_dtype, units} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      out_dtype,
      units: IntImmNode.fromtvm({id: +units, nodes, visited}),
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);

export const paramIdxs = () => [1];
