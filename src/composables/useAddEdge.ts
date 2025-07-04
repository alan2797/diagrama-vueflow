// src/composables/useEdgeUtils.ts
import { computed } from 'vue';
import type { EdgeProps } from '@vue-flow/core';

export function useAddEdge(props: Pick<EdgeProps, 'sourceX' | 'sourceY' | 'targetX' | 'targetY'>) {
  const buttonSize = 24;

  const edgePath = computed(() => {
    const { sourceX, sourceY, targetX, targetY } = props;
    return `M${sourceX},${sourceY} L${targetX},${targetY}`;
  });

  const centerX = computed(() => (props.sourceX + props.targetX) / 2);
  const centerY = computed(() => (props.sourceY + props.targetY) / 2);

  return {
    edgePath,
    centerX,
    centerY,
    buttonSize,
  };
}
