<!-- src/components/nodes/StartNode.vue -->
<template>
  <div class="node-paso-simple" :class="{ 'node-activado': activado }">
    <OptionPaso icon="description" color="green-1" textColor="green" :label="label" />
    <div class="punto"></div>
  </div>
</template>

<script setup lang="ts">
import { usePasoSimpleNode } from 'src/composables/usePasoSimpleNode';
import OptionPaso from '../drawer/OptionPaso.vue';

const props = defineProps<{ data?: { label?: string; activado?: boolean } }>();
const { label, activado } = usePasoSimpleNode(props.data);
</script>

<style scoped>
.node-paso-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  border: 1px solid rgb(68, 206, 68);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

  transition: all 0.3s ease;
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
