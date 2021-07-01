import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {
  ArrayNode,
  FuncTypeNode,
  GlobalVarNode,
  NullNode,
  OpNode,
  relay,
  SpanNode,
  TypeNode,
  ValueNode,
} from '../';

export type TypeKey = 'relay.Call';
export const type_key: TypeKey = 'relay.Call';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    args: ArrayNode.Type<ValueNode.Type>;
    attrs?: relay.AttrsNode.Type;
    op: OpNode.Type | GlobalVarNode.Type<FuncTypeNode.Type>;
    span?: SpanNode.Type;
    type_args: ArrayNode.Type<TypeNode.Type>;
    _checked_type_: TypeNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    args: string;
    attrs: string;
    op: string;
    span: string;
    type_args: string;
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
    const {args, attrs, op, span, type_args, _checked_type_} = node.attrs;
    ret = {
      id,
      type_key,
      attrs: {
        _checked_type_: TypeNode.fromtvm({
          id: +_checked_type_,
          nodes,
          visited,
        }),
        args: ArrayNode.fromtvm<ValueNode.Type>({
          id: +args,
          nodes,
          visited,
          _test: ValueNode.test,
        }),
        ...(NullNode.stest(nodes[+attrs])
          ? {}
          : {
              attrs: relay.AttrsNode.fromtvm({id: +attrs, nodes, visited}),
            }),
        op: (OpNode.stest(nodes[+op]) ? OpNode : GlobalVarNode).fromtvm({
          id: +op,
          nodes,
          visited,
          _test: FuncTypeNode.test,
        }),
        type_args: ArrayNode.fromtvm<TypeNode.Type>({
          id: +type_args,
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
  let typeNodes: ArrayNode.Type<TypeNode.Type>;
  if (GlobalVarNode.testWithTypeFactory(FuncTypeNode.test)(node.attrs.op)) {
    const typeNode = node.attrs.op.attrs._checked_type_;

    if (!TypeNode.compare(node.attrs._checked_type_, typeNode.attrs.ret_type)) {
      throw new Error(
        typeMismatch(
          JSON.stringify(typeNode.attrs.ret_type, null, 2),
          JSON.stringify(node.attrs._checked_type_, null, 2),
        ) + " in Call node's __check_type__",
      );
    }

    typeNodes = typeNode.attrs.arg_types;
  } else {
    typeNodes = node.attrs.type_args;
  }

  if (node.attrs.args.data.length !== typeNodes.data.length) {
    throw new Error(
      `expecting ${typeNodes.data.length} arguments, recevied ${node.attrs.args.data.length} arguments`,
    );
  }

  for (let i = 0; i < node.attrs.args.data.length; i++) {
    if (
      node.attrs.args.data[i].attrs._checked_type_ &&
      typeNodes.data[i] &&
      !TypeNode.compare(
        node.attrs.args.data[i].attrs._checked_type_,
        typeNodes.data[i],
      )
    ) {
      throw new Error(
        typeMismatch(
          JSON.stringify(node.attrs.args.data[i].attrs._checked_type_, null, 2),
          JSON.stringify(typeNodes.data[i], null, 2),
        ) +
          ' at index: ' +
          i,
      );
    }
  }
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
