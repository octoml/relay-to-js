export * from './nodes/';
export {fromtvm} from './fromtvm';

import {GenericNode} from './nodes/';
export type GraphData = {
  root: number;
  nodes: GenericNode.SType[];
  b64ndarrays: string[];
  attrs: any;
};
