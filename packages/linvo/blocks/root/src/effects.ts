import {
  EdgelessRootBlockComponent,
  EdgelessRootPreviewBlockComponent,
  PreviewRootBlockComponent,
} from './index.js';

export function effects() {
  // Register components by category
  registerRootComponents();
}

function registerRootComponents() {
  customElements.define('linvo-preview-root', PreviewRootBlockComponent);
  customElements.define('linvo-edgeless-root', EdgelessRootBlockComponent);
  customElements.define(
    'linvo-edgeless-root-preview',
    EdgelessRootPreviewBlockComponent
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-edgeless-root': EdgelessRootBlockComponent;
    'linvo-preview-root': PreviewRootBlockComponent;
  }
}
