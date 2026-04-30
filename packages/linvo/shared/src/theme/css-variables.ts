/* CSS variables. You need to handle all places where `CSS variables` are marked. */

import { LINE_COLORS } from '@linvo/linvo-model';
import {
  type LinvoCssVariables,
  type LinvoTheme,
  cssVar,
} from '@linvo/theme';
export { cssVar } from '@linvo/theme';
import { type LinvoThemeKeyV2, cssVarV2 } from '@linvo/theme/v2';
import { unsafeCSS } from 'lit';
export { cssVarV2 } from '@linvo/theme/v2';
export const ColorVariables = [
  '--linvo-brand-color',
  '--linvo-primary-color',
  '--linvo-secondary-color',
  '--linvo-tertiary-color',
  '--linvo-hover-color',
  '--linvo-icon-color',
  '--linvo-icon-secondary',
  '--linvo-border-color',
  '--linvo-divider-color',
  '--linvo-placeholder-color',
  '--linvo-quote-color',
  '--linvo-link-color',
  '--linvo-edgeless-grid-color',
  '--linvo-success-color',
  '--linvo-warning-color',
  '--linvo-error-color',
  '--linvo-processing-color',
  '--linvo-text-emphasis-color',
  '--linvo-text-primary-color',
  '--linvo-text-secondary-color',
  '--linvo-text-disable-color',
  '--linvo-black-10',
  '--linvo-black-30',
  '--linvo-black-50',
  '--linvo-black-60',
  '--linvo-black-80',
  '--linvo-black-90',
  '--linvo-black',
  '--linvo-white-10',
  '--linvo-white-30',
  '--linvo-white-50',
  '--linvo-white-60',
  '--linvo-white-80',
  '--linvo-white-90',
  '--linvo-white',
  '--linvo-background-code-block',
  '--linvo-background-tertiary-color',
  '--linvo-background-processing-color',
  '--linvo-background-error-color',
  '--linvo-background-warning-color',
  '--linvo-background-success-color',
  '--linvo-background-primary-color',
  '--linvo-background-secondary-color',
  '--linvo-background-modal-color',
  '--linvo-background-overlay-panel-color',
  '--linvo-tag-blue',
  '--linvo-tag-green',
  '--linvo-tag-teal',
  '--linvo-tag-white',
  '--linvo-tag-purple',
  '--linvo-tag-red',
  '--linvo-tag-pink',
  '--linvo-tag-yellow',
  '--linvo-tag-orange',
  '--linvo-tag-gray',
  ...LINE_COLORS,
  '--linvo-tooltip',
  '--linvo-blue',
];

export const SizeVariables = [
  '--linvo-font-h-1',
  '--linvo-font-h-2',
  '--linvo-font-h-3',
  '--linvo-font-h-4',
  '--linvo-font-h-5',
  '--linvo-font-h-6',
  '--linvo-font-base',
  '--linvo-font-sm',
  '--linvo-font-xs',
  '--linvo-line-height',
  '--linvo-z-index-modal',
  '--linvo-z-index-popover',
];

export const FontFamilyVariables = [
  '--linvo-font-family',
  '--linvo-font-number-family',
  '--linvo-font-code-family',
];

export const StyleVariables = [
  '--linvo-editor-width',

  '--linvo-theme-mode',
  '--linvo-editor-mode',
  /* --linvo-palette-transparent: special values added for the sake of logical consistency. */
  '--linvo-palette-transparent',

  '--linvo-popover-shadow',
  '--linvo-menu-shadow',
  '--linvo-float-button-shadow',
  '--linvo-shadow-1',
  '--linvo-shadow-2',
  '--linvo-shadow-3',

  '--linvo-paragraph-space',
  '--linvo-popover-radius',
  '--linvo-scale',
  ...SizeVariables,
  ...ColorVariables,
  ...FontFamilyVariables,
] as const;

type VariablesType = typeof StyleVariables;
export type CssVariableName = Extract<
  VariablesType[keyof VariablesType],
  string
>;

export type CssVariablesMap = Record<CssVariableName, string>;

export const unsafeCSSVar = (
  key: keyof LinvoCssVariables | keyof LinvoTheme,
  fallback?: string
) => unsafeCSS(cssVar(key, fallback));

export const unsafeCSSVarV2 = (key: LinvoThemeKeyV2, fallback?: string) =>
  unsafeCSS(cssVarV2(key, fallback));
