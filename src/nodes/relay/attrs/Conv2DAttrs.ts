import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../../common';
import {ArrayNode, IntImmNode} from '../../';

export type TypeKey = 'relay.attrs.Conv2DAttrs';
export const type_key: TypeKey = 'relay.attrs.Conv2DAttrs';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    channels: ArrayNode.Type<IntImmNode.Type> | IntImmNode.Type;
    data_layout: string;
    dilation: ArrayNode.Type<IntImmNode.Type>;
    groups: string;
    kernel_layout: string;
    kernel_size: ArrayNode.Type<IntImmNode.Type>;
    out_dtype: string;
    out_layout: string;
    padding: ArrayNode.Type<IntImmNode.Type>;
    strides: ArrayNode.Type<IntImmNode.Type>;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    channels: string;
    data_layout: string;
    dilation: string;
    groups: string;
    kernel_layout: string;
    kernel_size: string;
    out_dtype: string;
    out_layout: string;
    padding: string;
    strides: string;
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

  const {
    channels,
    data_layout,
    dilation,
    groups,
    kernel_layout,
    kernel_size,
    out_dtype,
    out_layout,
    padding,
    strides,
  } = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      channels: IntImmNode.stest(nodes[+channels])
        ? IntImmNode.fromtvm({id: +channels, nodes, visited})
        : ArrayNode.fromtvm<IntImmNode.Type>({
            id: +channels,
            nodes,
            visited,
            _test: IntImmNode.test,
          }),
      data_layout,
      dilation: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +dilation,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
      groups,
      kernel_layout,
      kernel_size: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +kernel_size,
        nodes,
        visited,
        _test: IntImmNode.test,
      }),
      out_dtype,
      out_layout,
      padding: ArrayNode.fromtvm<IntImmNode.Type>({
        id: +padding,
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

export const paramIdxs = () => [1];
