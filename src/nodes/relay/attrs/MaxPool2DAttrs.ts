import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../../common';
import {ArrayNode, IntImmNode} from '../../';

export type TypeKey = 'relay.attrs.MaxPool2DAttrs';
export const type_key: TypeKey = 'relay.attrs.MaxPool2DAttrs';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    ceil_mode: string;
    layout: string;
    padding: ArrayNode.Type<IntImmNode.Type>;
    pool_size: ArrayNode.Type<IntImmNode.Type>;
    strides: ArrayNode.Type<IntImmNode.Type>;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    ceil_mode: string;
    layout: string;
    padding: string;
    pool_size: string;
    strides: string;
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

  const {ceil_mode, layout, padding, pool_size, strides} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      ceil_mode,
      layout,
      padding: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +padding,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
      pool_size: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +pool_size,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
      strides: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +strides,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
    },
  });
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
