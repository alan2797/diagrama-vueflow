export const TIPO_PASO_SIMPLE = 'simple';
export const TIPO_PASO_BRUNCH = 'brunch';
export const TIPO_PASO_BRANCH = 'branch';
export const TIPO_PASO_GOTO = 'goto';

export const TIPOS_PASO = [
  TIPO_PASO_SIMPLE,
  TIPO_PASO_BRUNCH,
  TIPO_PASO_GOTO,
  TIPO_PASO_BRANCH,
] as const;

export type TipoPaso = (typeof TIPOS_PASO)[number];
