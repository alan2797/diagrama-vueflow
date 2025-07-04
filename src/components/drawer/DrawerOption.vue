<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    side="right"
    behavior="mobile"
    elevated
    :width="500"
    class="my-drawer-dialog"
  >
    <q-card class="my-drawer-card" style="padding: 10px !important; width: 100%">
      <q-card-section class="q-gutter-md">
        <div>
          <div class="text-subtitle2 text-green-8 q-mb-sm">Tipos de pasos simple</div>
          <OptionPaso
            icon="description"
            color="green-1"
            textColor="green"
            label="Paso simple"
            @click="seleccionar('simple')"
          />
        </div>

        <div>
          <div class="text-subtitle2 text-orange-8 q-mb-sm">Tipos de pasos brunch</div>
          <OptionPaso
            icon="lan"
            color="orange-1"
            textColor="orange-4"
            label="Paso brunch"
            @click="seleccionar('brunch')"
          />
        </div>

        <div>
          <div class="text-subtitle2 text-brown-5 q-mb-sm">Otros tipos de pasos</div>
          <OptionPaso
            icon="alt_route"
            color="brown-1"
            textColor="brown-7"
            label="Paso ir a"
            @click="seleccionar('goto')"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" @click="emit('update:modelValue', false)" />
      </q-card-actions>
    </q-card>
  </q-drawer>
</template>

<style>
.my-drawer-dialog {
  /* Puedes ajustar estilos para el drawer si quieres */
  max-width: 90vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

.my-drawer-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 0 !important;
}
</style>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import OptionPaso from './OptionPaso.vue';
import type { Edge } from '@vue-flow/core';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'seleccion', tipo: string): void;
}>();

function seleccionar(tipo: string) {
  console.log('drawer: ', props);
  emit('seleccion', tipo);
  emit('update:modelValue', false);
}
</script>
