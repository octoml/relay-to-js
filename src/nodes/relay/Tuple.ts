import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {ArrayNode, SpanNode, TupleTypeNode, TypeNode, ValueNode} from '../';

export type TypeKey = 'relay.Tuple';
export const type_key: TypeKey = 'relay.Tuple';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    index: string;
    span?: SpanNode.Type;
    _checked_type_: TupleTypeNode.Type;
    fields: ArrayNode.Type<ValueNode.Type>;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    index: string;
    span: string;
    _checked_type_: string;
    fields: string;
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
    const {index, span, _checked_type_, fields} = node.attrs;
    ret = {
      id,
      type_key,
      attrs: {
        index,
        _checked_type_: TupleTypeNode.fromtvm({
          id: +_checked_type_,
          nodes,
          visited,
        }),
        fields: ArrayNode.fromtvm({id: +fields, nodes, visited, _test: ValueNode.test}),
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
  const types = node.attrs._checked_type_.attrs.fields;
  const values = node.attrs.fields.data;

  if (types.data.length !== values.length) {
    throw new Error(`mismatch length: expecting ${types.data.length}, received ${values.length}`);
  }

  for (let i = 0; i < values.length; i++) {
    const t = types.data[i];
    const v = values[i];

    if (!TypeNode.compare(t, v.attrs._checked_type_)) {
      throw new Error(typeMismatch(
        JSON.stringify(t, null, 2),
        JSON.stringify(v, null, 2),
      ));
    }
  }
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
