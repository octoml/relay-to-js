import {FromTVMParams, stestFactory, testFactory, typeMismatch} from './common';
import {FuncTypeNode, relay, TupleTypeNode} from './';

export type TypeKey = 'FuncType' | 'TupleType' | 'relay.TensorType';
export const type_keys = ['FuncType', 'TupleType', 'relay.TensorType'];

export type Type =
  | FuncTypeNode.Type
  | TupleTypeNode.Type
  | relay.TensorTypeNode.Type;

export type SType =
  | FuncTypeNode.SType
  | TupleTypeNode.SType
  | relay.TensorTypeNode.SType;

export function fromtvm(params: FromTVMParams): Type {
  const node = params.nodes[params.id];
  switch (node.type_key) {
    case 'FuncType':
      return FuncTypeNode.fromtvm(params);
    case 'TupleType':
      return TupleTypeNode.fromtvm(params);
    case 'relay.TensorType':
      return relay.TensorTypeNode.fromtvm(params);
    case '':
      return null;
    default:
      throw new Error(typeMismatch(type_keys.join(' or '), node.type_key));
  }
}

export function compare(n1: Type, n2: Type) {
  if (!n1 || !n2) {
    return !n1 && !n2;
  } else if (n1.type_key === 'FuncType' && n2.type_key === 'FuncType') {
    return FuncTypeNode.compare(n1, n2);
  } else if (n1.type_key === 'TupleType' && n2.type_key === 'TupleType') {
    return TupleTypeNode.compare(n1, n2);
  } else if (
    n1.type_key === 'relay.TensorType' &&
    n2.type_key === 'relay.TensorType'
  ) {
    return relay.TensorTypeNode.compare(n1, n2);
  }
  return false;
}

export const test = testFactory<Type>(type_keys);
export const stest = stestFactory<SType>(type_keys);
