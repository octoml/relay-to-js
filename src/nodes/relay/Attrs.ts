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
  | attrs.Conv2DAttrsNode.TypeKey
  | attrs.DenseAttrsNode.TypeKey
  | attrs.DropoutAttrsNode.TypeKey
  | attrs.GlobalPool2DAttrsNode.TypeKey
  | attrs.MaxPool2DAttrsNode.TypeKey
  | attrs.SoftmaxAttrsNode.TypeKey;
export const type_keys = [
  'relay.attrs.BatchNormAttrs',
  'relay.attrs.BiasAddAttrs',
  'relay.attrs.Conv2DAttrs',
  'relay.attrs.DenseAttrs',
  'relay.attrs.DropoutAttrs',
  'relay.attrs.GlobalPool2DAttrs',
  'relay.attrs.MaxPool2DAttrs',
  'relay.attrs.SoftmaxAttrs',
];

export type Type =
  | attrs.BatchNormAttrsNode.Type
  | attrs.BiasAddAttrsNode.Type
  | attrs.Conv2DAttrsNode.Type
  | attrs.DenseAttrsNode.Type
  | attrs.DropoutAttrsNode.Type
  | attrs.GlobalPool2DAttrsNode.Type
  | attrs.MaxPool2DAttrsNode.Type
  | attrs.SoftmaxAttrsNode.Type;

export type SType =
  | attrs.BatchNormAttrsNode.SType
  | attrs.BiasAddAttrsNode.SType
  | attrs.Conv2DAttrsNode.SType
  | attrs.DenseAttrsNode.SType
  | attrs.DropoutAttrsNode.SType
  | attrs.GlobalPool2DAttrsNode.SType
  | attrs.MaxPool2DAttrsNode.SType
  | attrs.SoftmaxAttrsNode.SType;

export function fromtvm(params: FromTVMParams): Type {
  const node = params.nodes[params.id];
  switch (node.type_key) {
    case 'relay.attrs.BatchNormAttrs':
      return attrs.BatchNormAttrsNode.fromtvm(params);
    case 'relay.attrs.BiasAddAttrs':
      return attrs.BiasAddAttrsNode.fromtvm(params);
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
    case 'relay.attrs.SoftmaxAttrs':
      return attrs.SoftmaxAttrsNode.fromtvm(params);
    default:
      throw new Error(typeMismatch(type_keys.join(' or '), node.type_key));
  }
}

export const test = testFactory<Type>(type_keys);
export const stest = stestFactory<SType>(type_keys);
