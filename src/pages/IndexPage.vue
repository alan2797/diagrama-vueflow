<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <VueFlow
          v-model="elements"
          :node-types="nodeTypes"
          :edge-types="edgeTypes"
          :fit-view-on-init="true"
          :fit-view="true"
          style="height: 96vh"
          class="basic-flow"
          :default-viewport="{ zoom: 0.5 }"
          :min-zoom="0.2"
          @node-click="handleNodeClick"
        >
          <Controls position="top-left"> </Controls>

          <Background pattern-color="#aaa" :gap="16" />
          <MiniMap />
        </VueFlow>
        <DrawerOption v-model="mostrarDrawer" @seleccion="onSeleccionarPaso" />
        <DrawerEditarSimple
          v-model="mostrarDrawerEditarSimple"
          :paso-data="{ label: selectedNode?.data?.label || '' }"
          @submit="handleSubmit"
        />
        <DrawerEditarBranch
          v-model="mostrarDrawerEditarBranch"
          :paso-data="{
            label: selectedNode?.data?.label || '',
            labelHijo1: selectedNodeHijo1?.data?.label || '',
            labelHijo2: selectedNodeHijo2?.data?.label || '',
          }"
          @submit="handleSubmitBranch"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Edge, XYPosition, Node, NodeMouseEvent } from '@vue-flow/core';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import StartNode from 'components/nodes/StartNode.vue';
import EndNode from 'components/nodes/EndNode.vue';
import AddEdge from 'components/edges/AddEdge.vue';
import DrawerOption from 'components/drawer/DrawerOption.vue';
import { provide } from 'vue';
import PasoSimpleNode from 'components/nodes/PasoSimpleNode.vue';
import type { GraphNode } from '@vue-flow/core';
import type { CSSProperties } from 'vue';
import BranchNode from 'components/nodes/BranchNode.vue';
import BranchHijo from 'components/nodes/BranchHijo.vue';
import { initialElements } from '../data/initialFlowData';
import {
  TIPO_PASO_SIMPLE,
  TIPO_PASO_BRUNCH,
  TIPO_PASO_BRANCH,
  TIPO_PASO_GOTO,
  TipoPaso,
} from '../constants/tiposPasos'; // ajusta la ruta según tu estructura
import DrawerEditarSimple from 'components/drawer/DrawerEditarSimple.vue';
import DrawerEditarBranch from 'components/drawer/DrawerEditarBranch.vue';

type NodeTypesObject = Record<string, object>;
type EdgeTypesObject = Record<string, object>;
type FlowElement = Node | Edge;
type Element = Node | Edge;
const mostrarDrawer = ref(false);
const mostrarDrawerEditarSimple = ref(false);
const mostrarDrawerEditarBranch = ref(false);
const edgeTarget = ref(false);
const selectedEdge = ref<Edge | null>(null);
const selectedNode = ref<Node | null>(null);
const selectedNodeHijo1 = ref<Node | null>(null);
const selectedNodeHijo2 = ref<Node | null>(null);

interface PositionedNode extends Node {
  id: string;
  type: string;
  position: XYPosition;
  data?: Record<string, unknown>;
  style?: Record<string, string | number>;
}

provide('onAddEdgeClick', (props: Edge) => {
  edgeTarget.value = false;
  alumbrarNodos(false);
  console.log('event: ', props);
  selectedEdge.value = props;
  mostrarDrawer.value = true;
});

const nodeTypes: NodeTypesObject = {
  start: StartNode,
  end: EndNode,
  simple: PasoSimpleNode,
  branch: BranchNode,
  hijo: BranchHijo,
};

const edgeTypes: EdgeTypesObject = {
  add: AddEdge,
};

const elements = ref<FlowElement[]>(initialElements);

const handleSubmit = (data: { label: string }) => {
  // Actualizar el nodo con el nuevo label
  console.log(data);
  if (selectedNode.value) {
    selectedNode.value.data.label = data.label;
  }
};

const handleSubmitBranch = (data: { label: string; labelHijo1: string; labelHijo2: string }) => {
  if (!selectedNode.value) {
    console.warn('No hay nodo seleccionado');
    return;
  }

  // Actualizar nodo padre
  selectedNode.value.data.label = data.label;

  // Obtener conexiones hijas
  const childConnections = elements.value
    .filter((el): el is Edge => 'source' in el && el.source === selectedNode.value?.id)
    .slice(0, 2); // Tomar solo los primeros 2 hijos

  // Actualizar hijos
  childConnections.forEach((edge, index) => {
    const child = elements.value.find((el) => el.id === edge.target);
    if (child?.data) {
      child.data.label = index === 0 ? data.labelHijo1 : data.labelHijo2;
    }
  });
};

// Opción 1: Cuando se hace click en un nodo (incluso si ya estaba seleccionado)
const handleNodeClick = (node: NodeMouseEvent) => {
  console.log('Nodo clickeado:', node.node.id);
  const clickedNode = node.node;
  selectedNode.value = node.node;
  console.log(selectedNode.value);
  if (edgeTarget.value && selectedEdge.value) {
    if (![TIPO_PASO_SIMPLE, TIPO_PASO_BRANCH].includes(clickedNode.type)) {
      alert('No es posible la operación');
      return;
    }
    const edge = selectedEdge.value;
    const idEdge = `edge-${edge.source}-${Date.now()}`;

    // Verificar que no se esté creando una conexión circular (nodo consigo mismo)
    if (edge.target === clickedNode.id) {
      alert('No se pueden crear conexiones circulares al mismo nodo');

      return;
    }

    const newEdges: Edge[] = [
      {
        id: idEdge,
        source: edge.target,
        target: node.node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'gray' },
        // Otras propiedades de Edge si las necesitas
      },
    ];

    // Añadir el nuevo edge al array de edges
    elements.value = [...elements.value, ...newEdges];

    edgeTarget.value = false;
    alumbrarNodos(false);

    selectedEdge.value = null;
  } else {
    switch (clickedNode.type) {
      case TIPO_PASO_SIMPLE:
        mostrarDrawerEditarSimple.value = true;
        break;
      case TIPO_PASO_BRANCH:
        // Obtener conexiones hijas

        if (!selectedNode.value) break; // Validación temprana
        {
          const childConnections = elements.value
            .filter((el): el is Edge => 'source' in el && el.source === selectedNode.value?.id)
            .slice(0, 2); // Tomar solo los primeros 2 hijos

          // Actualizar hijos
          childConnections.forEach((edge, index) => {
            const child = elements.value.find((el) => el.id === edge.target);
            if (child) {
              if (index == 0) {
                selectedNodeHijo1.value = child as Node;
              } else {
                selectedNodeHijo2.value = child as Node;
              }
            }
          });
          mostrarDrawerEditarBranch.value = true;
        }
        break;
      default:
        break;
    }
  }
};

function alumbrarNodos(enable = true) {
  console.log('entro a alumbrar');
  elements.value = elements.value.map((node) => {
    node.data.activado = enable;
    if (selectedEdge.value) {
      if (node.id == selectedEdge.value.target) node.data.source = enable;
    }
    return node;
  });
}

function onSeleccionarPaso(tipo: string) {
  console.log('Paso seleccionado:', tipo);
  console.log('edge seleccionado:', selectedEdge.value);
  let newElements: FlowElement[] = elements.value;
  switch (tipo) {
    case TIPO_PASO_SIMPLE:
      newElements = insertarNodoSimple();

      if (newElements) {
        elements.value = newElements;
      }
      break;
    case TIPO_PASO_BRUNCH:
      newElements = insertarNodoBrunch();

      if (newElements) {
        elements.value = newElements;
      }
      break;
    case TIPO_PASO_GOTO:
      edgeTarget.value = true;
      alumbrarNodos(edgeTarget.value);
      break;
    default:
      break;
  }
}

function isPositionedNode(node: unknown): node is PositionedNode {
  if (!node || typeof node !== 'object') return false;

  const positionedNode = node as Record<string, unknown>;

  return (
    typeof positionedNode.id === 'string' &&
    'type' in positionedNode &&
    'position' in positionedNode &&
    positionedNode.position !== null &&
    typeof positionedNode.position === 'object' &&
    'x' in positionedNode.position &&
    'y' in positionedNode.position &&
    typeof positionedNode.position.x === 'number' &&
    typeof positionedNode.position.y === 'number'
  );
}

function getNodeVisualWidth(nodo: Node): number {
  const style = nodo.style;

  if (!style) return 100;

  if (typeof style === 'function') {
    const resolved = style(nodo as GraphNode); // ejecutamos la función
    return extractWidth(resolved as CSSProperties);
  }

  return extractWidth(style);
}

function extractWidth(styleObj: CSSProperties): number {
  const rawWidth = styleObj.width;

  if (typeof rawWidth === 'number') return rawWidth;

  if (typeof rawWidth === 'string') {
    const match = rawWidth.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 100;
  }

  return 100;
}

function insertarNodoSimple(): FlowElement[] {
  const edge = selectedEdge.value;
  if (!edge?.source || !edge?.target) {
    console.error('Edge inválido: falta source o target');
    return elements.value;
  }

  // Buscar nodos source y target
  const sourceNode = elements.value.find((el) => el.id === edge.source) as Node;
  const targetNode = elements.value.find((el) => el.id === edge.target) as Node;

  if (!sourceNode || !targetNode) return elements.value;
  const withNodoSource = getNodeVisualWidth(sourceNode);
  const anchoNodo = 260;
  const positionX = sourceNode.position.x + withNodoSource / 2 - anchoNodo / 2;

  const espacioVertical = 130;

  // Posición nuevo nodo
  const nuevoNodoY = sourceNode.position.y + espacioVertical;

  // Validación completa de los nodos
  if (!isPositionedNode(sourceNode)) {
    console.error('Nodo source no tiene posición válida');
    return elements.value;
  }

  if (!isPositionedNode(targetNode)) {
    console.error('Nodo target no tiene posición válida');
    return elements.value;
  }

  const nodeType = 'simple';
  // Crear nuevo nodo con todas las propiedades requeridas
  const newNode: PositionedNode = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    position: { x: positionX, y: nuevoNodoY },
    data: { label: `Paso ${nodeType}` },
    // Puedes agregar más propiedades según necesites
    style: { width: '260px' }, // Ejemplo de estilo
  };

  // Posición nodo target más abajo
  //sourceNode.position.x = positionX;
  targetNode.position.y = nuevoNodoY + espacioVertical;

  // Calcular posición del nuevo nodo
  const newNodePosition = {
    x: (sourceNode.position.x + targetNode.position.x) / 2,
    y: (sourceNode.position.y + targetNode.position.y) / 2,
  };
  // Identificar nodos que están debajo del nuevo nodo
  const nodesBelow = elements.value.filter(
    (el) => !('source' in el) && el.position.y > newNodePosition.y,
  ) as Node[];

  // Mover nodos inferiores 130px hacia abajo
  const movedNodes = nodesBelow.map((node) => {
    let espacio = espacioVertical;
    if (node.id === targetNode.id) {
      espacio = 0;
    }
    return {
      ...node,
      position: {
        x: node.position.x,
        y: node.position.y + espacio,
      },
    };
  });
  // Filtrar elementos originales (eliminar edge original y nodos que se moverán)
  const remainingElements = elements.value.filter(
    (el) => el.id !== edge.id && !nodesBelow.some((n) => n.id === el.id),
  );
  const newEdges: Edge[] = [
    {
      id: `edge-${edge.source}-${newNode.id}`,
      source: edge.source,
      target: newNode.id,
      type: edge.type || 'default',
      // Otras propiedades de Edge si las necesitas
    },
    {
      id: `edge-${newNode.id}-${edge.target}`,
      source: newNode.id,
      target: edge.target,
      type: edge.type || 'default',
    },
  ];

  return [...remainingElements, newNode, ...movedNodes, ...newEdges];
}
function insertarNodoBrunch(): FlowElement[] {
  const edge = selectedEdge.value;
  if (!edge?.source || !edge?.target) {
    console.error('Edge inválido: falta source o target');
    return elements.value;
  }

  // Buscar nodos source y target
  const sourceNode = elements.value.find((el) => el.id === edge.source) as Node;
  const targetNode = elements.value.find((el) => el.id === edge.target) as Node;

  //if (!sourceNode || !targetNode) return;

  const anchoNodo = 260;
  const withNodoSource = getNodeVisualWidth(sourceNode);
  console.log(withNodoSource);
  const positionX = sourceNode.position.x + withNodoSource / 2 - anchoNodo / 2;

  const espacioVertical = 130;

  // Posición nuevo nodo
  const nuevoNodoY = sourceNode.position.y + espacioVertical;

  // Validación completa de los nodos
  if (!isPositionedNode(sourceNode)) {
    console.error('Nodo source no tiene posición válida');
    return elements.value;
  }

  if (!isPositionedNode(targetNode)) {
    console.error('Nodo target no tiene posición válida');
    return elements.value;
  }

  // 4. Crear nuevos IDs
  const branchId = `branch-${Date.now()}`;
  const leftChildId = `hijo-${Date.now()}-1`;
  const rightChildId = `hijo-${Date.now()}-2`;
  const offsetX = 150;
  const offsetY = 130;
  // 5. Crear nuevos nodos
  const newBranchNode: Node = {
    id: branchId,
    type: 'branch',
    position: { x: positionX, y: nuevoNodoY },
    data: { label: 'Nombre de paso branch' },
    style: { width: '260px' },
  };

  const leftChildNode: Node = {
    id: leftChildId,
    type: 'hijo',
    position: {
      x: positionX - offsetX,
      y: nuevoNodoY + offsetY,
    },
    data: { label: 'Nombre de rama' },
    style: { width: '260px' },
    selectable: false,
    focusable: false,
  };

  const rightChildNode: Node = {
    id: rightChildId,
    type: 'hijo',
    position: {
      x: positionX + offsetX,
      y: nuevoNodoY + offsetY,
    },
    data: { label: 'Nombre de rama' },
    style: { width: '260px' },
    selectable: false,
    focusable: false,
  };

  const idHijoFin = `end-${Date.now()}-1`;
  const nodoEndHijoDerecho: Node = {
    id: idHijoFin,
    type: 'end',
    position: {
      x: positionX + offsetX + 200 / 2,
      y: nuevoNodoY + offsetY + offsetY,
    },
    data: {
      label: 'Fin',
    },
    style: {
      width: '60px',
    },
  };

  // 6. Crear nuevos edges
  const newEdges: Edge[] = [
    {
      id: `edge-${Date.now()}-1`,
      source: edge.source,
      target: branchId,
      type: 'add',
    },
    {
      id: `edge-${Date.now()}-2`,
      source: branchId,
      target: leftChildId,
      type: 'smoothstep',
    },
    {
      id: `edge-${Date.now()}-3`,
      source: branchId,
      target: rightChildId,
      type: 'smoothstep',
    },
    {
      id: `edge-${Date.now()}-4`,
      source: leftChildId,
      target: targetNode.id,
      type: 'add',
    },
    {
      id: `edge-${Date.now()}-5`,
      source: rightChildId,
      target: idHijoFin,
      type: 'add',
    },
  ];

  // Posición nodo target más abajo
  //sourceNode.position.x = positionX;
  targetNode.position.y = nuevoNodoY + espacioVertical;

  // Calcular posición del nuevo nodo
  const newNodePosition = {
    x: sourceNode.position.x,
    y: sourceNode.position.y,
  };
  // Identificar nodos que están debajo del nuevo nodo
  const nodesBelow = elements.value.filter(
    (el) => !('source' in el) && el.position.y > newNodePosition.y,
  ) as Node[];

  // Mover nodos inferiores 130px hacia abajo
  const movedNodes = nodesBelow.map((node) => {
    let espacio = espacioVertical;
    if (node.id === targetNode.id) {
      espacio = 100;
    } else {
      espacio = espacio + 100;
    }
    return {
      ...node,
      position: {
        x: node.position.x,
        y: node.position.y + espacio,
      },
    };
  });

  // Filtrar elementos originales (eliminar edge original y nodos que se moverán)
  const remainingElements = elements.value.filter(
    (el) => el.id !== edge.id && !nodesBelow.some((n) => n.id === el.id),
  );

  const copia = [
    ...remainingElements,
    newBranchNode,
    leftChildNode,
    rightChildNode,
    nodoEndHijoDerecho,
    ...movedNodes,
    ...newEdges,
  ];

  const nodosDesplazdaos = desplazarHijosIzquierda(leftChildId, copia as Node[], 150);
  console.log(nodosDesplazdaos);
  return nodosDesplazdaos;
}
function desplazarHijosIzquierda(
  parentId: string,
  nodes: FlowElement[],
  desplazamiento: number = 150,
): FlowElement[] {
  // 1. Copiar el array original para no mutarlo directamente
  const updatedNodes = [...nodes];

  // 2. Función recursiva para encontrar y desplazar hijos
  const desplazarRecursivo = (currentParentId: string) => {
    // Buscar todos los edges que salen del currentParentId
    const edgesFromParent = updatedNodes.filter(
      (el): el is Edge => 'source' in el && el.source === currentParentId,
    );

    edgesFromParent.forEach((edge) => {
      // Encontrar el nodo hijo correspondiente al edge
      const childNode = updatedNodes.find(
        (el): el is Node => !('source' in el) && el.id === edge.target,
      );

      if (childNode) {
        // Desplazar el nodo hijo
        childNode.position.x -= desplazamiento;
        childNode.position.y += 30;

        // Procesar los hijos de este nodo (recursión)
        desplazarRecursivo(childNode.id);
      }
    });
  };

  // 3. Iniciar el proceso desde el nodo padre
  desplazarRecursivo(parentId);

  return updatedNodes;
}
</script>
