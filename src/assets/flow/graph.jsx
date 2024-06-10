import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState, updateEdge } from 'reactflow';
import { Button, Table } from "antd";
import {StepBackwardOutlined , StepForwardOutlined} from "@ant-design/icons";
import 'reactflow/dist/style.css';
import { useState, useCallback, useRef } from 'react';

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // ['A', 'B', 'C', ..., 'Z']

const initialNodes = [
    // {
    //   id:"1",
    //   data:{
    //     label:"A",
    //   },
    //   position:{
    //     x:-300,
    //     y:0
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"2",
    //   data:{
    //     label:"B",
    //   },
    //   position:{
    //     x:-200,
    //     y:-60
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"3",
    //   data:{
    //     label:"C",
    //   },
    //   position:{
    //     x:-120,
    //     y:0
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"4",
    //   data:{
    //     label:"D",
    //   },
    //   position:{
    //     x:-200,
    //     y:60
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"5",
    //   data:{
    //     label:"E",
    //   },
    //   position:{
    //     x:-40,
    //     y:-60
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"6",
    //   data:{
    //     label:"F",
    //   },
    //   position:{
    //     x:-40,
    //     y:60
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
    // {
    //   id:"7",
    //   data:{
    //     label:"G",
    //   },
    //   position:{
    //     x:100,
    //     y:0
    //   },
    //   sourcePosition:"right",
    //   targetPosition: "left",
    //   style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
    // },
  
  ];

  const initialEdges = [
    // {
    //   id:"1",
    //   source:"1",
    //   target:"2",
    //   label:"2",
  
    // },
    // {
    //   id:"2",
    //   source:"1",
    //   target:"3",
    //   label:"1",
  
    // },
    // {
    //   id:"3",
    //   source:"1",
    //   target:"4",
    //   label:"4",
  
    // },
    // {
    //   id:"4",
    //   source:"2",
    //   target:"5",
    //   label:"1",
  
    // },
    // {
    //   id:"5",
    //   source:"2",
    //   target:"3",
    //   label:"2",
  
    // },
    // {
    //   id:"6",
    //   source:"2",
    //   target:"4",
    //   label:"3",
  
    // },
    // {
    //   id:"7",
    //   source:"3",
    //   target:"4",
    //   label:"3",
  
    // },
    // {
    //   id:"8",
    //   source:"3",
    //   target:"6",
    //   label:"5",
  
    // },
    // {
    //   id:"9",
    //   source:"4",
    //   target:"6",
    //   label:"1",
  
    // },
    // {
    //   id:"10",
    //   source:"4",
    //   target:"5",
    //   label:"3",
  
    // },
    // {
    //   id:"11",
    //   source:"5",
    //   target:"6",
    //   label:"6",
  
    // },
    // {
    //   id:"12",
    //   source:"5",
    //   target:"7",
    //   label:"5",
  
    // },
    // {
    //   id:"13",
    //   source:"6",
    //   target:"7",
    //   label:"2",
  
    // },
  ];
  

const highlightNodesAndEdges = async (currentNode, distances, pq, nodes, edges, setNodes, setEdges) => {
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
  
  const generateTableStep = (nodes, distances) => {
    return nodes.map(node => ({
      node: node.data.label,
      distance: distances[node.id] === Infinity ? '∞' : distances[node.id],
    }));
  };
  
  class PriorityQueueShort {
    constructor() {
      this.collection = [];
    }
  
    enqueue(element) {
      if (this.isEmpty()) {
        this.collection.push(element);
      } else {
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (element.distance < this.collection[i].distance) {
            this.collection.splice(i, 1, element);
            added = true;
            break;
          }
        }
        if (!added) {
          this.collection.push(element);
        }
      }
    }
  
    dequeue() {
      return this.collection.shift();
    }
  
    isEmpty() {
      return this.collection.length === 0;
    }
    toArray(){
      return this.collection.splice();
    }
    ishas(Node){
      return this.collection.some(item=>item.id===Node);
    }
  }
  class PriorityQueueLong {
    constructor() {
      this.collection = [];
    }
  
    enqueue(element) {
      if (this.isEmpty()) {
        this.collection.push(element);
      } else {
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (element.distance > this.collection[i].distance) {
            this.collection.splice(i, 1, element);
            added = true;
            break;
          }
        }
        if (!added) {
          this.collection.push(element);
        }
      }
    }
  
    dequeue() {
      return this.collection.shift();
    }
  
    isEmpty() {
      return this.collection.length === 0;
    }
    toArray(){
      return this.collection.splice();
    }
    ishas(Node){
      return this.collection.some(item=>item.id===Node);
    }
  }
  
  
  const findShortestPath = async (nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps) => {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueueShort(); // Utilisation d'un tas binaire pour la file de priorité
    const visited = new Set();
    const steps = [generateTableStep(nodes, distances)]; // Ajouter l'étape initiale
  
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      prev[node.id] = null;
    });
  
    distances[startNode] = 0;
    pq.enqueue({ id: startNode, distance: 0 });
  
    while (!pq.isEmpty()) {
      const { id: currentNode } = pq.dequeue(); // Extraire le nœud avec la plus petite distance
      await highlightNodesAndEdges(currentNode, distances, pq.toArray(), nodes, edges, setNodes, setEdges);
  
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
        console.log(prev);
        steps.push(generateTableStep(nodes, distances)); // Ajouter une nouvelle étape
        
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
  function findPath(nouveauprev,endNode) {
    let path = [];
    let u = endNode;
  
    while (u !== null) {
      path.unshift(u);
      u = nouveauprev[u];
  
      // Si `u` est une liste, prenez le premier élément de la liste
      if (Array.isArray(u)) {
        // Ajoutez les autres éléments de la liste à `path`
        for (let val of u.slice(1)) {
          path.unshift(val);
        }
        // Prenez le premier élément comme le prochain nœud à visiter
        u = u[0];
      }
    }
  
    // Ajouter le startNode au chemin si nécessaire
    
  
    return path;
  }
  console.log(nouveauprev);
  let path = findPath(nouveauprev,endNode);
    console.log(path);
    if (distances[endNode] !== Infinity) {
      path.unshift(startNode);
    }
  
    const pathEdges = [];
    for (let i = 1; i < path.length ; i++) {
      const source = path[i];
      const targets = Array.isArray(nouveauprev[ path[i]]) ? nouveauprev[ path[i]] : [nouveauprev[ path[i]]]; // Vérifie si la valeur est un tableau
      targets.forEach(target => {
        const edge = edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source));
          if (edge) {
              pathEdges.push(edge.id);

          }
      });
  }
  
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        style: { ...node.style, stroke: 'white' } // Réinitialiser le style des nœuds
      }));
      return updatedNodes;
    });
  
    setEdges((edges) => {
      const updatedEdges = edges.map((edge) => ({
        ...edge,
        style: {
          stroke: pathEdges.includes(edge.id) ? 'green' : 'black'
        }
      }));
      return updatedEdges;
    });
  
    setProcessingSteps(steps);
    return path;
  };
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
  
  const findLongestPath = async (nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps) => {
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
      const { id: currentNode } = pq.dequeue(); // Extraire le nœud avec la plus petite distance
      await highlightNodesAndEdges(currentNode, distances, pq.toArray(), nodes, edges, setNodes, setEdges);
  
      if (currentNode === endNode) break;
  
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        console.log("noeud actuelle "+currentNode);
        const neighbors = edges.filter((edge) => 
          (edge.source === currentNode && !visited.has(edge.target)) ||
          (edge.target === currentNode && !visited.has(edge.source))
        );
  
        neighbors.forEach((neighbor) => {
          const weight = parseFloat(neighbor.label);
          const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
          const alt = distances[currentNode] + weight;
          console.log("distance parcours "+alt);
          console.log("neoud a visiter "+neighborNode);
          if (alt > distances[neighborNode]) {
            distances[neighborNode] = alt;
            prev[neighborNode] = currentNode;
            pq.enqueue({ id: neighborNode, distance: alt });
          }
          console.log(prev);
        });
        steps.push(generateTableStep(nodes, distances)); // Ajouter une nouvelle étape
        
      }
    }
    
  
    const path = [];
    let u = endNode;
    while (prev[u]) {
      path.unshift(u);
      u = prev[u];
    }
    if (distances[endNode] !== Infinity) {
      path.unshift(startNode);
    }
    
  
    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const source = path[i];
      const target = path[i + 1];
      const edge = edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source));
      if (edge) {
        pathEdges.push(edge.id);
      }
    }
  
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        style: { ...node.style, stroke: 'white' } // Réinitialiser le style des nœuds
      }));
      return updatedNodes;
    });
  
    setEdges((edges) => {
      const updatedEdges = edges.map((edge) => ({
        ...edge,
        style: {
          stroke: pathEdges.includes(edge.id) ? 'green' : 'black'
        }
      }));
      return updatedEdges;
    });
  
    setProcessingSteps(steps);

    return path;
  };
  
  function Flow() {
    const edgeUpdateSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [alphabetIndex, setAlphabetIndex] = useState(0);
    const [processingSteps, setProcessingSteps] = useState([[]]);
    const [currentStep, setCurrentStep] = useState(0);
    const onConnect = useCallback((params) => {
      const weight = prompt('Entrer le poids ici', '1');
      const edge = { ...params, label: weight };
      setEdges((eds) => addEdge(edge, eds));
    }, [setEdges]);
  
    const createNode = () => {
      if (alphabetIndex < alphabet.length) {
        const newLabel = alphabet[alphabetIndex];
        const newNode = {
          id: (nodes.length + 1).toString(),
          data: { label: newLabel, position: 'right' },
          position: { x: Math.random() * 250, y: Math.random() * 250 },
          sourcePosition: "right",
          targetPosition: "left",
          style: { color: 'black', borderRadius: '200px', padding: '10px', width: "35px" },
        };
        setNodes((nds) => nds.concat(newNode));
        setAlphabetIndex(alphabetIndex + 1);
      } else {
        console.log('Plus de lettre disponible');
      }
    };

    const resetGraphStyles = () => {
        const resetNodes = nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                backgroundColor: 'white', // Couleur de fond par défaut
            },
        }));
    
        const resetEdges = edges.map(edge => ({
            ...edge,
            style: {
                stroke: 'black', // Couleur de bordure par défaut
            },
        }));
    
        setNodes(resetNodes);
        setEdges(resetEdges);
    };
  
    const onEdgeUpdateStart = useCallback(() => {
      edgeUpdateSuccessful.current = false;
    }, []);
  
    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, [setEdges]);
  
    const onEdgeUpdateEnd = useCallback((_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    }, [setEdges]);
  
    const onEdgeDoubleClick = useCallback((event, edge) => {
      const newLabel = prompt('Entrez le poids ici', edge.label);
      if (newLabel) {
        setEdges((eds) => eds.map((e) => e.id === edge.id ? { ...e, label: newLabel } : e));
      }
    }, [setEdges]);
  
    const handleShortestPath = async () => {
      const startNode = nodes[0]?.id;
      const endNode = nodes[nodes.length - 1]?.id;
  
      if (!startNode || !endNode) {
        alert('Creer au moins deux noeuds.');
        return;
      }

  const shortestPath = await findShortestPath(nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps);
  const nouveauprev=findPrev(nodes, edges, startNode, endNode);
  console.log(shortestPath);
  console.log(nouveauprev);
  if (shortestPath.length === 0) {
    alert('Pas de.');
    return;
  }

  const pathEdges = [];
  for (let i = 1; i < shortestPath.length ; i++) {
    const source = shortestPath[i];
    const targets =  Array.isArray(nouveauprev[ shortestPath[i]]) ? nouveauprev[ shortestPath[i]] : [nouveauprev[ shortestPath[i]]];
    targets.forEach(target => {
      const edge = edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source));
      console.log(source);
      console.log(target);
        if (edge) {

            pathEdges.push(edge.id);
            console.log(pathEdges);
        }
    });
  }

  const updatedNodes = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      backgroundColor: shortestPath.includes(node.id) ? 'deepskyblue' : 'white'
    }
  }));

  const updatedEdges = edges.map((edge) => ({
    ...edge,
    style: {
      stroke: pathEdges.includes(edge.id) ? 'deepskyblue' : 'black'
    }
  }));

  setNodes(updatedNodes);
  setEdges(updatedEdges);
};
const handleLongestPath = async () => {
  const startNode = nodes[0]?.id;
  const endNode = nodes[nodes.length - 1]?.id;

  if (!startNode || !endNode) {
    alert('Creer au moins deux noeuds.');
    return;
  }

const LongestPath = await findLongestPath(nodes, edges, startNode, endNode, setNodes, setEdges, setProcessingSteps);
if (LongestPath.length === 0) {
alert('Chemin introuvable');
return;
}

const pathEdges = [];
for (let i = 0; i < LongestPath.length - 1; i++) {
const source = LongestPath[i];
const target = LongestPath[i + 1];
const edge = edges.find((e) => (e.source === source && e.target === target) || (e.source === target && e.target === source));
if (edge) {
  pathEdges.push(edge.id);
}
}

const updatedNodes = nodes.map((node) => ({
...node,
style: {
  ...node.style,
  backgroundColor: LongestPath.includes(node.id) ? 'deepskyblue' : 'white'
}
}));

const updatedEdges = edges.map((edge) => ({
...edge,
style: {
  stroke: pathEdges.includes(edge.id) ? 'deepskyblue' : 'black'
}
}));

setNodes(updatedNodes);
setEdges(updatedEdges);
};


const columns = [
  {
    title: 'A',
    dataIndex: 'distance',
    key: "node",
  },
  {
    title: 'B',
    dataIndex: 'distance',
    key: "node",
  },
  {
    title: 'C',
    dataIndex: 'distance',
    key: "node",
  },
  {
    title: 'D',
    dataIndex: 'distance',
    key: "node",
  },
  {
    title: 'E',
    dataIndex: 'distance',
    key: "node",
  },  
  {
    title: 'F',
    dataIndex: 'distance',
    key: "node",
  },
];

// const row=[
//   {
//     title: 'Node',
//     dataIndex: 'node',
//     key: 'node',
//   },
//   {
//     title: 'Distance',
//     dataIndex: 'distance',
//     key: 'distance',
//   },
// ];

const [isShort,setIsShort] = useState(true);

const handleShortestPathClick = () => {
    setIsShort(true); // Met à jour isShort à true lorsque le bouton "chemin le plus court" est cliqué
  };

  const handleLongestPathClick = () => {
    setIsShort(false); // Met à jour isShort à false lorsque le bouton "chemin le plus long" est cliqué
  };



return (
  <div style={{ height: '100%' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeDoubleClick={onEdgeDoubleClick}
      snapToGrid
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      onConnect={onConnect}
      fitView
    >
      <Background variant='lines' />
      <Controls>
        <button
          onClick={createNode}
          style={{ background: 'skyblue', border: 'none', padding: "10px" }}
        >
          C
        </button>
      </Controls>
    </ReactFlow>

    <div style={{marginTop:"10px"}}>
        <Button style={{ marginRight:"10px"}} onClick={handleShortestPathClick}>chemin le plus court</Button>
        <Button onClick={handleLongestPathClick}>chemin le plus long</Button>
    </div>

<div>{
    isShort ? (
        <div>
        <div style={{ margin: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
     <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
     <StepBackwardOutlined />
      </Button>
      <Button type='primary' onClick={handleShortestPath}>
        Chemin minimal
      </Button>
      <Button disabled={currentStep === processingSteps.length - 1} onClick={() => setCurrentStep(currentStep + 1)}>
      <StepForwardOutlined />
      </Button>
      <Button style={{ marginLeft: "20px" }} onClick={resetGraphStyles}>
        Réinitialiser les traitements
      </Button>
    </div>
    <div style={{ margin: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Table
      dataSource={processingSteps[currentStep]}
      columns={columns}
      pagination={false}
      rowKey="node"
      style={{ margin: "20px", width: "600px" }}
    />
    </div>
    </div>

    ) : (
        <div>
        <div style={{ margin: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
      <StepBackwardOutlined />      </Button>
      <Button type='default' onClick={handleLongestPath}>
        Chemin maximal
      </Button>
      <Button  disabled={currentStep === processingSteps.length - 1} onClick={() => setCurrentStep(currentStep + 1)}>
      <StepForwardOutlined />
      </Button>
      <Button style={{ marginLeft: "20px" }} onClick={resetGraphStyles} type="primary">
        Réinitialiser les traitements
      </Button>
    </div>
    <div style={{ margin: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Table
      dataSource={processingSteps[currentStep]}
      columns={columns}
      pagination={false}
      rowKey="node"
      style={{ margin: "20px", width: "600px" }}
    />
    </div>
</div>
    )
    }</div>
    
    

    
  </div>
);
}

export default Flow;

  
  