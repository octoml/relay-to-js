import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from '../common';
import {SpanNode, TypeNode, ValueNode} from '../';

export type TypeKey = 'relay.If';
export const type_key: TypeKey = 'relay.If';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    _checked_type_: TypeNode.Type;
    cond: ValueNode.Type;
    false_branch: ValueNode.Type;
    span?: SpanNode.Type;
    true_branch: ValueNode.Type;
  };
};
// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    _checked_type_: string;
    cond: string;
    false_branch: string;
    span: string;
    true_branch: string;
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
    const {_checked_type_, cond, false_branch, span, true_branch} = node.attrs;
    ret = {
      id,
      type_key,
      attrs: {
        _checked_type_: TypeNode.fromtvm({
          id: +_checked_type_,
          nodes,
          visited,
        }),
        cond: ValueNode.fromtvm({id: +cond, nodes, visited}),
        false_branch: ValueNode.fromtvm({id: +false_branch, nodes, visited}),
        true_branch: ValueNode.fromtvm({id: +true_branch, nodes, visited}),
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
    !TypeNode.compare(
      node.attrs._checked_type_,
      node.attrs.true_branch.attrs._checked_type_,
    )
  ) {
    throw new Error(
      typeMismatch(
        JSON.stringify(node.attrs._checked_type_, null, 2),
        JSON.stringify(node.attrs.true_branch.attrs._checked_type_, null, 2),
      ),
    );
  }

  if (
    !TypeNode.compare(
      node.attrs._checked_type_,
      node.attrs.false_branch.attrs._checked_type_,
    )
  ) {
    throw new Error(
      typeMismatch(
        JSON.stringify(node.attrs._checked_type_, null, 2),
        JSON.stringify(node.attrs.false_branch.attrs._checked_type_, null, 2),
      ),
    );
  }
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
