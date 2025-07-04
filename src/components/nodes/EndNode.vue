<template>
  <div class="node-end" :class="{ 'nodo-source': source }">
    <span class="label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { useEndNode } from 'src/composables/useEndNode';
const props = defineProps<{ data?: { label?: string; source?: boolean } }>();
const { label, source } = useEndNode(props.data);
</script>

<style scoped>
.node-end {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #929292;
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
.nodo-source {
  background-color: white;
  color: white;
  border-radius: 50%;
  height: 60px;
  border: 1px solid gray;
}
</style>
