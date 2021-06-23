import {GenericNode} from './';

export type BaseType = {
  id: number;
};

export type DType = 'float32' | 'int32' | string;

export type GType = GenericNode.Type;
export type GSType = GenericNode.SType;

export type FromTVMParams = {
  id: number;
  nodes: GSType[];
  visited: GType[];
};

export const typeMismatch = (expect: string, received: string) =>
  `Type mismatch from TVM, expecting "${expect}", but receiving "${received}"`;

export const visitedTypeMismatch = (
  idx: number,
  expect: string,
  received: string,
) =>
  `This node is visited at index ${idx} but has a different type ("${expect}") instead of "${received}"`;

export type Test<T extends GType> = ((node: GType) => node is T) & {
  type: string[];
};

export function testFactory<T extends GType>(
  type_key: string | string[],
): Test<T> {
  type_key = Array.isArray(type_key) ? type_key : [type_key];
  return Object.assign(
    (node: GType): node is T => node && type_key.includes(node.type_key),
    {type: type_key},
  );
}

export type STest<RT extends GSType> = ((node: GSType) => node is RT) & {
  type: string[];
};

export function stestFactory<RT extends GSType>(
  type_key: string | string[],
): STest<RT> {
  type_key = Array.isArray(type_key) ? type_key : [type_key];
  return Object.assign(
    (node: GSType): node is RT => node && type_key.includes(node.type_key),
    {type: type_key},
  );
}
