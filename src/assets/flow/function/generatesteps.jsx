export const generateTableStep = (nodes, distances) => {
    return nodes.map(node => ({
      node: node.data.label,
      distance: distances[node.id] === Infinity ? '∞' : distances[node.id],
    }));
  };