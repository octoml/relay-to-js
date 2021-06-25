import {TypeNode} from '.';
import * as ArrayNode from './Array';
import {testFactory, FromTVMParams, stestFactory} from './common';
import * as FuncTypeNode from './FuncType';
import * as GlobalVarNode from './GlobalVar';
import * as IntImmNode from './IntImm';
import * as NullNode from './Null';
import * as OpNode from './Op';
import * as relay from './relay/index';
import * as runtime from './runtime/index';
import * as SourceNameNode from './SourceName';
import * as SpanNode from './Span';
import * as TupleTypeNode from './TupleType';

export const type_keys = [
  NullNode.type_key,
  ArrayNode.type_key,
  FuncTypeNode.type_key,
  IntImmNode.type_key,
  OpNode.type_key,
  TupleTypeNode.type_key,
  GlobalVarNode.type_key,
  SpanNode.type_key,
  SourceNameNode.type_key,
  // relay
  relay.IfNode.type_key,
  relay.ConstantNode.type_key,
  relay.CallNode.type_key,
  relay.FunctionNode.type_key,
  relay.IdNode.type_key,
  relay.TensorTypeNode.type_key,
  relay.TupleGetItemNode.type_key,
  relay.VarNode.type_key,
  // relay.attrs
  ...relay.AttrsNode.type_keys,
  // runtime
  runtime.StringNode.type_key,
];

export type Type =
  | NullNode.Type
  | ArrayNode.Type<any>
  | FuncTypeNode.Type
  | IntImmNode.Type
  | OpNode.Type
  | TupleTypeNode.Type
  | GlobalVarNode.Type<TypeNode.Type>
  | SpanNode.Type
  | SourceNameNode.Type
  // relay
  | relay.IfNode.Type
  | relay.ConstantNode.Type
  | relay.CallNode.Type
  | relay.FunctionNode.Type
  | relay.IdNode.Type
  | relay.TensorTypeNode.Type
  | relay.TupleGetItemNode.Type
  | relay.VarNode.Type
  // relay.attrs
  | relay.AttrsNode.Type
  // runtime
  | runtime.StringNode.Type;

export type SType =
  | NullNode.SType
  | ArrayNode.SType
  | FuncTypeNode.SType
  | IntImmNode.SType
  | OpNode.SType
  | TupleTypeNode.SType
  | GlobalVarNode.SType
  | SpanNode.SType
  | SourceNameNode.SType
  // relay
  | relay.IfNode.SType
  | relay.ConstantNode.SType
  | relay.CallNode.SType
  | relay.FunctionNode.SType
  | relay.IdNode.SType
  | relay.TensorTypeNode.SType
  | relay.TupleGetItemNode.SType
  | relay.VarNode.SType
  // relay.attrs
  | relay.AttrsNode.SType
  // runtime
  | runtime.StringNode.SType;

export function fromtvm(params: FromTVMParams): Type {
  const node = params.nodes[params.id];
  switch (node.type_key) {
    case 'Array':
      return ArrayNode.fromtvm(params);
    case 'FuncType':
      return FuncTypeNode.fromtvm(params);
    case 'GlobalVar':
      return GlobalVarNode.fromtvm(params);
    case 'IntImm':
      return IntImmNode.fromtvm(params);
    case '':
      return NullNode.fromtvm(params);
    case 'Op':
      return OpNode.fromtvm(params);
    case 'SourceName':
      return SourceNameNode.fromtvm(params);
    case 'Span':
      return SpanNode.fromtvm(params);
    case 'TupleType':
      return TupleTypeNode.fromtvm(params);
    case 'relay.Call':
      return relay.CallNode.fromtvm(params);
    case 'relay.Constant':
      return relay.ConstantNode.fromtvm(params);
    case 'relay.Function':
      return relay.FunctionNode.fromtvm(params);
    case 'relay.Id':
      return relay.IdNode.fromtvm(params);
    case 'relay.If':
      return relay.IfNode.fromtvm(params);
    case 'relay.TensorType':
      return relay.TensorTypeNode.fromtvm(params);
    case 'relay.TupleGetItem':
      return relay.TupleGetItemNode.fromtvm(params);
    case 'relay.Var':
      return relay.VarNode.fromtvm(params);
    case 'relay.attrs.BatchNormAttrs':
      return relay.attrs.BatchNormAttrsNode.fromtvm(params);
    case 'relay.attrs.BiasAddAttrs':
      return relay.attrs.BiasAddAttrsNode.fromtvm(params);
    case 'relay.attrs.Conv2DAttrs':
      return relay.attrs.Conv2DAttrsNode.fromtvm(params);
    case 'relay.attrs.DenseAttrs':
      return relay.attrs.DenseAttrsNode.fromtvm(params);
    case 'relay.attrs.DropoutAttrs':
      return relay.attrs.DropoutAttrsNode.fromtvm(params);
    case 'relay.attrs.GlobalPool2DAttrs':
      return relay.attrs.GlobalPool2DAttrsNode.fromtvm(params);
    case 'relay.attrs.MaxPool2DAttrs':
      return relay.attrs.MaxPool2DAttrsNode.fromtvm(params);
    case 'relay.attrs.SoftmaxAttrs':
      return relay.attrs.SoftmaxAttrsNode.fromtvm(params);
    case 'runtime.String':
      return runtime.StringNode.fromtvm(params);
  }
}

export const test = testFactory<Type>(type_keys);
export const stest = stestFactory<SType>(type_keys);
