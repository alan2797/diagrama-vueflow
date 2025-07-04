// src/composables/useStartNode.ts
import { computed } from 'vue';

export function usePasoSimpleNode(data?: { label?: string; activado?: boolean }) {
  const label = computed(() => data?.label ?? 'Paso Simple');
  const activado = computed(() => data?.activado ?? false);
  return { label, activado };
}
