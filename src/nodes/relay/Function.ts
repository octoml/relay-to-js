import {
  BaseType,
  FromTVMParams,
  GType,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {
  ArrayNode,
  FuncTypeNode,
  GenericNode,
  relay,
  SpanNode,
  TypeNode,
  ValueNode,
} from '../';

export type TypeKey = 'relay.Function';
export const type_key: TypeKey = 'relay.Function';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    attrs?: GType;
    body: ValueNode.Type;
    // TODO: can it be other type?
    params: ArrayNode.Type<relay.VarNode.Type>;
    ret_type: TypeNode.Type;
    span?: SpanNode.Type;
    type_params: ArrayNode.Type<TypeNode.Type>;
    _checked_type_: FuncTypeNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    attrs: string;
    body: string;
    params: string;
    ret_type: string;
    span: string;
    type_params: string;
    _checked_type_: string;
  };
};

export function fromtvm({id, nodes, visited}: FromTVMParams): Type {
  const node = nodes[id];
  if (node.type_key === '') return null;
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));

  const _visited = visited[id];
  let ret: Type;
  if (_visited) {
    if (!test(_visited)) {
      throw new Error(
        visitedTypeMismatch(id, _visited.type_key, node.type_key),
      );
    }
    ret = _visited;
  } else {
    const {_checked_type_, span, attrs, body, params, ret_type, type_params} =
      node.attrs;
    ret = {
      id,
      type_key,
      attrs: {
        _checked_type_: FuncTypeNode.fromtvm({
          id: +_checked_type_,
          nodes,
          visited,
        }),
        attrs: GenericNode.fromtvm({id: +attrs, nodes, visited}),
        body: ValueNode.fromtvm({id: +body, nodes, visited}),
        params: ArrayNode.fromtvm<relay.VarNode.Type>({
          id: +params,
          nodes,
          visited,
          _test: relay.VarNode.test,
        }),
        ret_type: TypeNode.fromtvm({id: +ret_type, nodes, visited}),
        type_params: ArrayNode.fromtvm<TypeNode.Type>({
          id: +type_params,
          nodes,
          visited,
          _test: TypeNode.test,
        }),
        ...(SpanNode.stest(nodes[+span])
          ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
          : {}),
      },
    };
  }

  check(ret);
  return (visited[id] = ret);
}

function check(node: Type) {
  if (
    node.attrs.ret_type &&
    node.attrs.body.attrs._checked_type_ &&
    !TypeNode.compare(node.attrs.ret_type, node.attrs.body.attrs._checked_type_)
  ) {
    throw new Error(
      typeMismatch(
        JSON.stringify(node.attrs.ret_type, null, 2),
        JSON.stringify(node.attrs.body.attrs._checked_type_, null, 2),
      ),
    );
  }
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
