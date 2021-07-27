import {
  FromTVMParams,
  stestFactory,
  testFactory,
  typeMismatch,
} from '../common';
import * as attrs from './attrs/';

export type TypeKey =
  | attrs.BatchNormAttrsNode.TypeKey
  | attrs.BiasAddAttrsNode.TypeKey
  | attrs.ClipAttrsNode.TypeKey
  | attrs.Conv1DAttrsNode.TypeKey
  | attrs.Conv2DAttrsNode.TypeKey
  | attrs.DenseAttrsNode.TypeKey
  | attrs.DropoutAttrsNode.TypeKey
  | attrs.GlobalPool2DAttrsNode.TypeKey
  | attrs.MaxPool2DAttrsNode.TypeKey
  | attrs.ReshapeAttrsNode.TypeKey
  | attrs.SoftmaxAttrsNode.TypeKey
  | attrs.TransposeAttrsNode.TypeKey;
export const type_keys = [
  'relay.attrs.BatchNormAttrs',
  'relay.attrs.BiasAddAttrs',
  'relay.attrs.ClipAttrs',
  'relay.attrs.Conv1DAttrs',
  'relay.attrs.Conv2DAttrs',
  'relay.attrs.DenseAttrs',
  'relay.attrs.DropoutAttrs',
  'relay.attrs.GlobalPool2DAttrs',
  'relay.attrs.MaxPool2DAttrs',
  'relay.attrs.ReshapeAttrs',
  'relay.attrs.SoftmaxAttrs',
  'relay.attrs.TransposeAttrsNode',
];

export type Type =
  | attrs.BatchNormAttrsNode.Type
  | attrs.BiasAddAttrsNode.Type
  | attrs.ClipAttrsNode.Type
  | attrs.Conv1DAttrsNode.Type
  | attrs.Conv2DAttrsNode.Type
  | attrs.DenseAttrsNode.Type
  | attrs.DropoutAttrsNode.Type
  | attrs.GlobalPool2DAttrsNode.Type
  | attrs.MaxPool2DAttrsNode.Type
  | attrs.ReshapeAttrsNode.Type
  | attrs.SoftmaxAttrsNode.Type
  | attrs.TransposeAttrsNode.Type;

export type SType =
  | attrs.BatchNormAttrsNode.SType
  | attrs.BiasAddAttrsNode.SType
  | attrs.ClipAttrsNode.SType
  | attrs.Conv1DAttrsNode.SType
  | attrs.Conv2DAttrsNode.SType
  | attrs.DenseAttrsNode.SType
  | attrs.DropoutAttrsNode.SType
  | attrs.GlobalPool2DAttrsNode.SType
  | attrs.MaxPool2DAttrsNode.SType
  | attrs.ReshapeAttrsNode.SType
  | attrs.SoftmaxAttrsNode.SType
  | attrs.TransposeAttrsNode.SType;

export function fromtvm(params: FromTVMParams): Type {
  const node = params.nodes[params.id];
  switch (node.type_key) {
    case 'relay.attrs.BatchNormAttrs':
      return attrs.BatchNormAttrsNode.fromtvm(params);
    case 'relay.attrs.BiasAddAttrs':
      return attrs.BiasAddAttrsNode.fromtvm(params);
    case 'relay.attrs.ClipAttrs':
      return attrs.ClipAttrsNode.fromtvm(params);
    case 'relay.attrs.Conv1DAttrs':
      return attrs.Conv1DAttrsNode.fromtvm(params);
    case 'relay.attrs.Conv2DAttrs':
      return attrs.Conv2DAttrsNode.fromtvm(params);
    case 'relay.attrs.DenseAttrs':
      return attrs.DenseAttrsNode.fromtvm(params);
    case 'relay.attrs.DropoutAttrs':
      return attrs.DropoutAttrsNode.fromtvm(params);
    case 'relay.attrs.GlobalPool2DAttrs':
      return attrs.GlobalPool2DAttrsNode.fromtvm(params);
    case 'relay.attrs.MaxPool2DAttrs':
      return attrs.MaxPool2DAttrsNode.fromtvm(params);
    case 'relay.attrs.ReshapeAttrs':
      return attrs.ReshapeAttrsNode.fromtvm(params);
    case 'relay.attrs.SoftmaxAttrs':
      return attrs.SoftmaxAttrsNode.fromtvm(params);
    case 'relay.attrs.TransposeAttrs':
      return attrs.TransposeAttrsNode.fromtvm(params);
    case '':
      return null;
    default:
      throw new Error(typeMismatch(type_keys.join(' or '), node.type_key));
  }
}

export const test = testFactory<Type>(type_keys);
export const stest = stestFactory<SType>(type_keys);
