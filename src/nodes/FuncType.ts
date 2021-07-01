import {
  BaseType,
  FromTVMParams,
  GType,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from './common';
import {ArrayNode, GenericNode, SpanNode, TypeNode} from './';

export type TypeKey = 'FuncType';
export const type_key: TypeKey = 'FuncType';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    arg_types: ArrayNode.Type<TypeNode.Type>;
    ret_type: TypeNode.Type;
    span?: SpanNode.Type;
    type_constraints: ArrayNode.Type<GType>;
    type_params: ArrayNode.Type<GType>;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    arg_types: string;
    ret_type: string;
    span: string;
    type_constraints: string;
    type_params: string;
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

  const {arg_types, ret_type, span, type_constraints, type_params} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      arg_types: ArrayNode.fromtvm<TypeNode.Type>({
        id: +arg_types,
        nodes,
        visited,
        _test: TypeNode.test,
      }),
      ret_type: TypeNode.fromtvm({id: +ret_type, nodes, visited}),
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
      type_constraints: ArrayNode.fromtvm<GType>({
        id: +type_constraints,
        nodes,
        visited,
        _test: GenericNode.test,
      }),
      type_params: ArrayNode.fromtvm<GType>({
        id: +type_params,
        nodes,
        visited,
        _test: GenericNode.test,
      }),
    },
  });
}

export function compare(n1: Type, n2: Type) {
  // todo: compare function type
  return n1 === n2;
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
