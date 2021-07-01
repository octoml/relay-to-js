import {TypeNode} from '.';
import {FromTVMParams, stestFactory, testFactory, typeMismatch} from './common';
import * as GlobalVarNode from './GlobalVar';
import * as relay from './relay/';

export type TypeKey =
  | 'GlobalVar'
  | 'relay.Call'
  | 'relay.Constant'
  | 'relay.Function'
  | 'relay.If'
  | 'relay.TupleGetItem'
  | 'relay.Var';
export const type_keys = [
  'GlobalVar',
  'relay.Call',
  'relay.Constant',
  'relay.Function',
  'relay.If',
  'relay.TupleGetItem',
  'relay.Var',
];

export type Type =
  | GlobalVarNode.Type<TypeNode.Type>
  | relay.IfNode.Type
  | relay.ConstantNode.Type
  | relay.CallNode.Type
  | relay.FunctionNode.Type
  | relay.TupleGetItemNode.Type
  | relay.VarNode.Type;

export type SType =
  | GlobalVarNode.SType
  | relay.IfNode.SType
  | relay.ConstantNode.SType
  | relay.CallNode.SType
  | relay.FunctionNode.SType
  | relay.TupleGetItemNode.SType
  | relay.VarNode.SType;

export function fromtvm(params: FromTVMParams): Type {
  const node = params.nodes[params.id];
  switch (node.type_key) {
    case 'GlobalVar':
      return GlobalVarNode.fromtvm(params);
    case 'relay.Call':
      return relay.CallNode.fromtvm(params);
    case 'relay.Constant':
      return relay.ConstantNode.fromtvm(params);
    case 'relay.Function':
      return relay.FunctionNode.fromtvm(params);
    case 'relay.If':
      return relay.IfNode.fromtvm(params);
    case 'relay.TupleGetItem':
      return relay.TupleGetItemNode.fromtvm(params);
    case 'relay.Var':
      return relay.VarNode.fromtvm(params);
    case '':
      return null;
    default:
      throw new Error(typeMismatch(type_keys.join(' or '), node.type_key));
  }
}

export const test = testFactory<Type>(type_keys);
export const stest = stestFactory<SType>(type_keys);
