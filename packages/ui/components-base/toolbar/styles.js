import { combinedDarkCssVariables, combinedLightCssVariables, } from '@theme';
import { unsafeCSS } from 'lit';
const toolbarColorKeys = [
    '--linvo-background-overlay-panel-color',
    '--linvo-v2-layer-background-overlayPanel',
    '--linvo-v2-layer-insideBorder-blackBorder',
    '--linvo-v2-icon-primary',
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
export const lightToolbarStyles = (selector) => `
  ${selector}[data-app-theme='light'] {
    ${toolbarColorKeys
    .map(key => `${key}: ${unsafeCSS(combinedLightCssVariables[key])};`)
    .join('\n')}
  }
`;
export const darkToolbarStyles = (selector) => `
  ${selector}[data-app-theme='dark'] {
    ${toolbarColorKeys
    .map(key => `${key}: ${unsafeCSS(combinedDarkCssVariables[key])};`)
    .join('\n')}
  }
`;
