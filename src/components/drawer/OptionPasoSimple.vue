<!-- src/components/ui/DrawerOption.vue -->
<template>
  <q-item clickable class="option-item" @click="$emit('click')">
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  textColor?: string;
}>();
defineEmits(['click']);
</script>

<style scoped>
.option-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 8px;
  width: 100%;
  text-align: center;
}
.icono-item {
  border-radius: 8px;
}
</style>
