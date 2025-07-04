// src/composables/useStartNode.ts
import { computed } from 'vue';

export function useStartNode(data?: { label?: string }) {
  const label = computed(() => data?.label ?? 'Inicio');
  return { label };
}
