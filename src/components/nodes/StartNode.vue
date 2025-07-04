<!-- src/components/nodes/StartNode.vue -->
<template>
  <div class="node-start">
    <span class="label">{{ label }}</span>
    <div class="punto"></div>
  </div>
</template>

<script setup lang="ts">
import { useStartNode } from 'src/composables/useStartNode';
const props = defineProps<{ data?: { label?: string } }>();
const { label } = useStartNode(props.data);
</script>

<style scoped>
.node-start {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}
.label {
  margin-left: 0px;
}
.punto {
  height: 7px;
  width: 7px;
  background-color: rgb(14, 186, 14);
  position: absolute;
  bottom: -5px;
  border-radius: 50%;
}
</style>
