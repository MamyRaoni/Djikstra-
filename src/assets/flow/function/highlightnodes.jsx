export const highlightNodesAndEdges = async (currentNode, distances, pq, nodes, edges, setNodes, setEdges) => {
    const updatedNodes = nodes.map((node) => {
      const isCurrentNode = node.id === currentNode;
      const isInQueue = pq.some((item) => item.id === node.id);
      const isVisited = distances[node.id] !== Infinity && distances[node.id] !== -Infinity;
  
      return {
        ...node,
        style: {
          ...node.style,
          backgroundColor: isCurrentNode
            ? 'yellow'
            : isInQueue
              ? 'lightblue'
              : isVisited
                ? 'lightgreen'
                : 'white',
        },
      };
    });
  
    const updatedEdges = edges.map((edge) => ({
      ...edge,
      style: {
        stroke: distances[edge.source] !== Infinity && distances[edge.target] !== Infinity ? 'green' : 'black',
      },
    }));
  
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai de 500ms pour visualiser les changements
  };