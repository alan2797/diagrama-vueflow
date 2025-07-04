<!-- src/components/edges/AddEdge.vue -->
<template>
  <g>
    <!-- Línea SVG entre source y target -->
    <path
      :d="edgePath"
      stroke="#ccc"
      stroke-width="1"
      fill="none"
      marker-start="url(#startpoint)"
      marker-end="url(#arrowhead)"
    />
    <!-- Definición de flecha -->
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ccc" />
      </marker>
      <!-- Punto al inicio -->
      <marker id="startpoint" markerWidth="5" markerHeight="5" refX="0" refY="2.5" orient="auto">
        <circle cx="2.5" cy="2.5" r="2.5" fill="#289f5a" />
      </marker>
    </defs>

    <!-- Botón "+" en el punto medio -->
    <foreignObject
      :x="centerX - buttonSize / 2"
      :y="centerY - buttonSize / 2"
      :width="buttonSize"
      :height="buttonSize"
    >
      <button
        @click.stop="onAddClick"
        style="
          width: 24px;
          height: 24px;
          border-radius: 12px;
          border: 1px solid gray;
          background-color: white;
          color: gray;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          padding: 0;
        "
        title="Agregar Paso"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="display: block"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { EdgeProps } from '@vue-flow/core';
import { useAddEdge } from '../../composables/useAddEdge';
import { inject } from 'vue';

const props = defineProps<EdgeProps>();

const onAddEdgeClick = inject<(edge: EdgeProps) => void>('onAddEdgeClick');

const { edgePath, centerX, centerY, buttonSize } = useAddEdge(props);

function onAddClick() {
  console.log('click add');
  console.log(props.id);
  if (onAddEdgeClick) onAddEdgeClick(props as EdgeProps); // Emitimos el ID del edge si lo necesitas
}
</script>
