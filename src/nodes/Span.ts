import {
  BaseType,
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
  visitedTypeMismatch,
} from './common';
import {SourceNameNode} from './';

export type TypeKey = 'Span';
export const type_key: TypeKey = 'Span';

// object type for TypeScript
export type Type = BaseType & {
  type_key: TypeKey;
  attrs: {
    column: string;
    end_column: string;
    end_line: string;
    line: string;
    source_name: SourceNameNode.Type;
  };
};

// serialized type from tvm
export type SType = {
  type_key: TypeKey;
  attrs: {
    column: string;
    end_column: string;
    end_line: string;
    line: string;
    source_name: string;
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

  const {column, end_column, end_line, line, source_name} = node.attrs;
  return (visited[id] = {
    id,
    type_key,
    attrs: {
      column,
      end_column,
      end_line,
      line,
      source_name: SourceNameNode.fromtvm({
        id: +source_name,
        nodes,
        visited,
      }),
    },
  });
}

export function compare(n1: Type, n2: Type) {
  const {attrs: a1} = n1;
  const {attrs: a2} = n2;

  return (
    a1.column === a2.column &&
    a1.end_column === a2.end_column &&
    a1.line === a2.line &&
    a1.end_line === a2.end_line &&
    SourceNameNode.compare(a1.source_name, a2.source_name)
  );
}

export const test = testFactory<Type>(type_key);
export const stest = stestFactory<SType>(type_key);
