import {
  type LinvoCssVariables,
  combinedDarkCssVariables,
  combinedLightCssVariables,
} from '@linvo/theme';
import { unsafeCSS } from 'lit';

const toolbarColorKeys: Array<keyof LinvoCssVariables> = [
  '--linvo-background-overlay-panel-color',
  '--linvo-v2-layer-background-overlayPanel' as never,
  '--linvo-v2-layer-insideBorder-blackBorder' as never,
  '--linvo-v2-icon-primary' as never,
  '--linvo-background-error-color',
  '--linvo-background-primary-color',
  '--linvo-background-tertiary-color',
  '--linvo-icon-color',
  '--linvo-icon-secondary',
  '--linvo-border-color',
  '--linvo-divider-color',
  '--linvo-text-primary-color',
  '--linvo-hover-color',
  '--linvo-hover-color-filled',
];

export const lightToolbarStyles = (selector: string) => `
  ${selector}[data-app-theme='light'] {
    ${toolbarColorKeys
      .map(key => `${key}: ${unsafeCSS(combinedLightCssVariables[key])};`)
      .join('\n')}
  }
`;

export const darkToolbarStyles = (selector: string) => `
  ${selector}[data-app-theme='dark'] {
    ${toolbarColorKeys
      .map(key => `${key}: ${unsafeCSS(combinedDarkCssVariables[key])};`)
      .join('\n')}
  }
`;
