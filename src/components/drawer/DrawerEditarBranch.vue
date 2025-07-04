<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    side="right"
    behavior="mobile"
    elevated
    :width="500"
    class="my-drawer-dialog bg-grey-2"
  >
    <q-card flat class="my-drawer-card full-height">
      <q-card-section style="padding: 30px">
        <div class="text-h6 q-pb-md">
          <q-icon name="lan" color="orange" :size="'28px'" /> Branch
        </div>

        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.label"
            label="Nombre del paso"
            outlined
            dense
            :rules="[(val) => !!val || 'El nombre es requerido']"
            lazy-rules
          />
          <q-input v-model="formData.labelHijo1" label="Nombre de condicion 1" outlined dense />
          <q-input v-model="formData.labelHijo2" label="Nombre de condicion 2" outlined dense />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md" style="padding: 0px 30px 0px 30px">
        <q-btn flat label="Eliminar" color="negative" @click="onDelete" />

        <q-btn flat label="Cancelar" color="black" @click="onCancel" />

        <q-btn color="black" label="Guardar" @click="onSubmit" style="border-radius: 7px" />
      </q-card-actions>
    </q-card>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface PasoData {
  label: string;
  labelHijo1: string;
  labelHijo2: string;
}

interface Props {
  modelValue: boolean;
  pasoData?: PasoData;
  modoEdicion?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pasoData: () => ({ label: '', labelHijo1: '', labelHijo2: '' }),
  modoEdicion: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: PasoData): void;
  (e: 'delete'): void;
}>();

const formData = ref<PasoData>({ label: '', labelHijo1: '', labelHijo2: '' });

watch(
  () => props.pasoData,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal };
    }
  },
  { immediate: true, deep: true },
);

const onSubmit = () => {
  console.log('guardar editar');
  emit('submit', { ...formData.value });
  emit('update:modelValue', false);
};

const onCancel = () => {
  emit('update:modelValue', false);
};

const onDelete = () => {
  emit('delete');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.my-drawer-card {
  border-radius: 0 !important;
}

.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
