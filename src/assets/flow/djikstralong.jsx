import { PriorityQueueLong } from './function/priorityQueueLong';
import { generateTableStep } from './function/generatesteps';
import { highlightNodesAndEdges } from './function/highlightnodes';

export const findLongestPath = async (nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps) => {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueueLong(); // Utilisation d'un tas binaire pour la file de priorité
    const visited = new Set();
    const steps = [generateTableStep(nodes, distances)]; // Ajouter l'étape initiale

    nodes.forEach((node) => {
        distances[node.id] = -Infinity;
        prev[node.id] = null;
    });

    distances[startNode] = 0;
    pq.enqueue({ id: startNode, distance: 0 });

    while (!pq.isEmpty()) {
        const { id: currentNode } = pq.dequeue(); // Extraire le nœud avec la plus grande distance
        await highlightNodesAndEdges(currentNode, distances, pq.toArray(), nodes, edges, setNodes, setEdges);

        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            if (currentNode === endNode && visited.size !== nodes.length) {
                continue;
            }

            console.log("Nœud actuel : " + currentNode);
            const neighbors = edges.filter((edge) => 
                (edge.source === currentNode && !visited.has(edge.target)) ||
                (edge.target === currentNode && !visited.has(edge.source))
            );

            neighbors.forEach((neighbor) => {
                const weight = parseFloat(neighbor.label);
                const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
                const alt = distances[currentNode] + weight;
                console.log("Nœud à visiter : " + neighborNode);
                console.log("Distance de parcours (alt) : " + alt);
                console.log("Distance du prochain nœud (distances[neighborNode]) : " + distances[neighborNode]);
                if (alt > distances[neighborNode]) {
                    distances[neighborNode] = alt;
                    prev[neighborNode] = currentNode;
                    pq.enqueue({ id: neighborNode, distance: alt });
                }
            });
            console.log(prev);
            steps.push(generateTableStep(nodes, distances)); // Ajouter une nouvelle étape
        }
    }

    const reconstructPath = (prev, endNode) => {
        let path = [];
        let u = endNode;

        while (prev[u] !== null) {
            path.unshift(u);
            u = prev[u];
        }

        if (path.length > 0) {
            path.unshift(startNode);
        }

        return path;
    };

    console.log(prev);
    let path = reconstructPath(prev, endNode);
    console.log(path);

    const pathEdges = [];
    for (let i = 1; i < path.length; i++) {
        const source = path[i - 1];
        const target = path[i];
        const edge = edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source));
        if (edge) {
            pathEdges.push(edge.id);
        }
    }

    setNodes((nodes) => {
        return nodes.map((node) => ({
            ...node,
            style: { ...node.style, stroke: 'white' } // Réinitialiser le style des nœuds
        }));
    });

    setEdges((edges) => {
        return edges.map((edge) => ({
            ...edge,
            style: {
                stroke: pathEdges.includes(edge.id) ? 'green' : 'black'
            }
        }));
    });

    setProcessingSteps(steps);
    return path;
};