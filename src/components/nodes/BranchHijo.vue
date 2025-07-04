<!-- src/components/nodes/StartNode.vue -->
<template>
  <div class="node-paso-branch-hijo">
    <OptionPasoSimple textColor="orange-4" :label="label" />
    <div class="punto"></div>
  </div>
</template>

<script setup lang="ts">
import { usePasoSimpleNode } from 'src/composables/usePasoSimpleNode';
import OptionPasoSimple from '../drawer/OptionPasoSimple.vue';

const props = defineProps<{ data?: { label?: string } }>();
const { label } = usePasoSimpleNode(props.data);
</script>

<style scoped>
.node-paso-branch-hijo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  border: 1px solid orange;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}
.label {
  margin-left: 0px;
}
.punto {
  height: 7px;
  width: 7px;
  background-color: orange;
  position: absolute;
  bottom: -5px;
  border-radius: 50%;
}
</style>
