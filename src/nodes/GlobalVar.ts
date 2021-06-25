import {
  BaseType,
  FromTVMParams,
  stestFactory,
  Test,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from './common';
import {GenericNode, runtime, SpanNode, TypeNode} from './';

export type TypeKey = 'GlobalVar';
export const type_key: TypeKey = 'GlobalVar';

// object type for TypeScript
export type Type<T extends TypeNode.Type> = BaseType & {
  type_key: TypeKey;
  attrs: {
    _checked_type_: T;
    name_hint: runtime.StringNode.Type;
    span?: SpanNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    _checked_type_: string;
    name_hint: string;
    span: string;
  };
};

export function fromtvm<T extends TypeNode.Type>({
  id,
  nodes,
  visited,
  _test,
}: FromTVMParams & {_test?: Test<T>}): Type<T> {
  const node = nodes[id];
  if (!stest(node)) throw new Error(typeMismatch(type_key, node.type_key));

  if (visited[id]) {
    const ret = visited[id];
    if (testWithType(ret, _test)) return ret;
    // TODO: error with generic type
    throw new Error(visitedTypeMismatch(id, ret.type_key, node.type_key));
  }

  const {_checked_type_, name_hint, span} = node.attrs;
  const __checked_type_ = TypeNode.fromtvm({
    id: +_checked_type_,
    nodes,
    visited,
  });

  if (!_test(__checked_type_)) {
    throw new Error('');
  }

  return (visited[id] = {
    id,
    type_key,
    attrs: {
      _checked_type_: __checked_type_,
      name_hint: runtime.StringNode.fromtvm({id: +name_hint, nodes, visited}),
      ...(SpanNode.stest(nodes[+span])
        ? {span: SpanNode.fromtvm({id: +span, nodes, visited})}
        : {}),
    },
  });
}

export const test = testFactory<Type<TypeNode.Type>>(type_key);
export const stest = stestFactory<SType>(type_key);

export function testWithType<T extends TypeNode.Type>(node: GenericNode.Type, t: Test<T>): node is Type<T> {
  return test(node) && t(node.attrs._checked_type_);
}