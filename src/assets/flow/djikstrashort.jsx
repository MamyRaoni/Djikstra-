import { PriorityQueueShort } from './function/priorityQueueShort';
import { generateTableStep } from './function/generatesteps';
import { highlightNodesAndEdges } from './function/highlightnodes';

export const findShortestPath = async (nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps) => {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueueShort(); // Using a binary heap for the priority queue
    const visited = new Set();
    const steps = [generateTableStep(nodes, distances)]; // Add the initial step

    nodes.forEach((node) => {
        distances[node.id] = Infinity;
        prev[node.id] = null;
    });

    distances[startNode] = 0;
    pq.enqueue({ id: startNode, distance: 0 });

    while (!pq.isEmpty()) {
        const { id: currentNode } = pq.dequeue(); // Extract the node with the smallest distance
        await highlightNodesAndEdges(currentNode, distances, pq.toArray(), nodes, edges, setNodes, setEdges);

        if (currentNode === endNode && visited==nodes) break;

        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            console.log("Current node: " + currentNode);
            const neighbors = edges.filter((edge) => ((edge.source === currentNode) || (edge.target === currentNode)));

            neighbors.forEach((neighbor) => {
                const weight = parseFloat(neighbor.label);
                const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
                const alt = distances[currentNode] + weight;
                console.log("Node to visit: " + neighborNode);
                console.log("Path distance (alt): " + alt);
                console.log("Next node distance (distances[neighborNode]): " + distances[neighborNode]);
                //enleve cette condition fa ça sert a rien 
                if (alt < distances[neighborNode]) {
                    distances[neighborNode] = alt;
                    prev[neighborNode] = currentNode;
                    pq.enqueue({ id: neighborNode, distance: alt });
                }
            });
            console.log(prev);
            steps.push(generateTableStep(nodes, distances)); // Add a new step
        }
    }

    const reconstructPath = (prev, endNode) => {
        let path = [];
        let u = endNode;

        while (u !== null) {
            path.unshift(u);
            u = prev[u];
        }

        return path;
    };

    console.log(prev);
    let path = reconstructPath(prev, endNode);
    console.log(path);
    if (distances[endNode] !== Infinity) {
        path.unshift(startNode);
    }

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
            style: { ...node.style, stroke: 'white' } // Reset node styles
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

export const findPrev = (nodes, edges, startNode, endNode) => {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueueShort(); // Using a binary heap for the priority queue
    const visited = new Set();

    nodes.forEach((node) => {
        distances[node.id] = Infinity;
        prev[node.id] = null;
    });

    distances[startNode] = 0;
    pq.enqueue({ id: startNode, distance: 0 });

    while (!pq.isEmpty()) {
        const { id: currentNode } = pq.dequeue(); // Extract the node with the smallest distance

        if (currentNode === endNode && visited==nodes) break;

        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            const neighbors = edges.filter((edge) => ((edge.source === currentNode) || (edge.target === currentNode)));

            neighbors.forEach((neighbor) => {
                const weight = parseFloat(neighbor.label);
                const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
                const alt = distances[currentNode] + weight;
                if (alt < distances[neighborNode]) {
                    distances[neighborNode] = alt;
                    prev[neighborNode] = currentNode;
                    pq.enqueue({ id: neighborNode, distance: alt });
                }
            });
        }
    }

    return prev;
};

