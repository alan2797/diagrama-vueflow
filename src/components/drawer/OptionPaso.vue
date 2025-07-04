<!-- src/components/ui/DrawerOption.vue -->
<template>
  <q-item clickable class="option-item" @click="$emit('click')">
    <q-item-section avatar>
      <q-avatar :color="color" text-color="white" class="icono-item">
        <q-icon :name="icon" :color="textColor" :size="'28px'" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  color?: string;
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
}
.icono-item {
  border-radius: 8px;
}
</style>
