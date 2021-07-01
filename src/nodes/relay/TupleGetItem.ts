import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {relay, SpanNode, TupleTypeNode, TypeNode, ValueNode} from '../';

export type TypeKey = 'relay.TupleGetItem';
export const type_key: TypeKey = 'relay.TupleGetItem';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    index: string;
    span?: SpanNode.Type;
    _checked_type_: relay.TensorTypeNode.Type;
    tuple_value: ValueNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    index: string;
    span: string;
    _checked_type_: string;
    tuple_value: string;
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
    const {index, span, _checked_type_, tuple_value} = node.attrs;
    ret = {
      id,
      type_key,
      attrs: {
        index,
        _checked_type_: relay.TensorTypeNode.fromtvm({
          id: +_checked_type_,
          nodes,
          visited,
        }),
        tuple_value: ValueNode.fromtvm({id: +tuple_value, nodes, visited}),
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
  const {_checked_type_: tuple_value_type} = node.attrs.tuple_value.attrs;
  if (!TupleTypeNode.test(tuple_value_type)) {
    throw new Error(typeMismatch('TupleType', tuple_value_type.type_key));
  }

  if (
    !TypeNode.compare(
      node.attrs._checked_type_,
      tuple_value_type.attrs.fields.data[+node.attrs.index],
    )
  ) {
    throw new Error(
      typeMismatch(
        JSON.stringify(node.attrs._checked_type_, null, 2),
        JSON.stringify(
          tuple_value_type.attrs.fields.data[+node.attrs.index],
          null,
          2,
        ),
      ),
    );
  }
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
