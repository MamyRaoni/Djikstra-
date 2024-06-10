const findPrev=(nodes, edges, startNode, endNode)=>{
    const distances = {};
    const prev = {};
    const pq = new PriorityQueueShort(); // Utilisation d'un tas binaire pour la file de priorité
    const visited = new Set(); // Ajouter l'étape initiale
  
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      prev[node.id] = null;
    });
  
    distances[startNode] = 0;
    pq.enqueue({ id: startNode, distance: 0 });
  
    while (!pq.isEmpty()) {
      const { id: currentNode } = pq.dequeue(); // Extraire le nœud avec la plus petite distance
  
      if (currentNode === endNode) break;
  
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        console.log("noeud actuelle "+currentNode);
        const neighbors = edges.filter((edge) => ((edge.source === currentNode) || (edge.target === currentNode)));
  
        neighbors.forEach((neighbor) => {
          const weight = parseFloat(neighbor.label);
          const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
          const alt = distances[currentNode] + weight;
          console.log("neoud a visiter "+neighborNode);
          console.log("distance parcours(alt) "+alt);
          console.log("distance du noeud suivante(distances.neighbordNode) "+distances[neighborNode]);
          if (alt < distances[neighborNode]) {
            distances[neighborNode] = alt;
            prev[neighborNode] = currentNode;
            pq.enqueue({ id: neighborNode, distance: alt });
          }
          else if(alt === distances[neighborNode]){
            distances[neighborNode] = alt;
            prev[neighborNode] += currentNode;
            pq.enqueue({ id: neighborNode, distance: alt });
          }
        });
        console.log(prev); // Ajouter une nouvelle étape
        
      }
    }
    


    let nouveauprev = {};

  for (let [key, value] of Object.entries(prev)) {
    if (value && value.length > 1) {
      // Séparer la chaîne en une liste de ses chiffres individuels
      nouveauprev[key] = value.split('');
    } else {
      // Conserver la valeur telle quelle si elle est unique ou null
      nouveauprev[key] = value;
    }
  }
  //return voloany (return prev nom function findprev)
  return nouveauprev;
}
const nouveauprev=findPrev(nodes, edges, startNode, endNode);