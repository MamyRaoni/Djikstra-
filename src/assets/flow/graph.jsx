import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState, updateEdge } from 'reactflow';
import { Button } from "antd";
import {StepBackwardOutlined , StepForwardOutlined} from "@ant-design/icons";
import 'reactflow/dist/style.css';
import { useState, useCallback, useRef } from 'react';
import { findShortestPath } from './djikstrashort';
import { findLongestPath } from './djikstralong';
import { findPrev } from './djikstrashort';


const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // ['A', 'B', 'C', ..., 'Z']

const initialNodes = 
  []
;

  const initialEdges = [];


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


const [isShort,setIsShort] = useState(true);

const handleShortestPathClick = () => {
    setIsShort(true); // Met à jour isShort à true lorsque le bouton "chemin le plus court" est cliqué
  };

  const handleLongestPathClick = () => {
    setIsShort(false); // Met à jour isShort à false lorsque le bouton "chemin le plus long" est cliqué
  };

  let initialStep;

  isShort ?( initialStep = nodes.map(node => ({
    node: node.data.label,
    distance: node.data.label === 'A' ? 0 : '\u221E',
  }))):(initialStep = nodes.map(node => ({
    node: node.data.label,
    distance: node.data.label === 'A' ? 0 : '-\u221E',
  })))
  


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
    
</div>
    )
    }</div>
    
    
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div>
      <p>Étape 0</p>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black', marginBottom: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Noeud</th>
            {initialStep.map(({ node }, index) => (
              <th key={`th-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{node}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>Distance</td>
            {initialStep.map(({ distance }, index) => (
              <td key={`td-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{distance}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>

    {processingSteps.map((step, index) => {
  if (index === 0) return null; // Ignore la première étape
  return (
    <div key={`div-${index}`}>
      <p>Étape {index}</p>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black', marginBottom: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Noeud</th>
            {step.map(({ node }, index ) => (
              <th key={`th-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{node}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>Distance</td>
            {step.map(({ distance }, index) => (
              <td key={`td-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{distance === -Infinity ? '-\u221E' : distance}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
})}

</div>
</div>
);
}

export default Flow;

  
  