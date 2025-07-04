// src/composables/useStartNode.ts
import { computed } from 'vue';

export function useEndNode(data?: { label?: string; source?: boolean }) {
  const label = computed(() => data?.label ?? 'Fin');
  const source = computed(() => data?.source ?? false);
  return { label, source };
}
