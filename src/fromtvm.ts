import {GenericNode} from './nodes';

export function fromtvm(nodes: GenericNode.SType[], root: number) {
  const visited = new Array<GenericNode.Type>(nodes.length);
  return {
    nodes: visited,
    rootNode: GenericNode.fromtvm({nodes, id: root, visited}),
  };
}
