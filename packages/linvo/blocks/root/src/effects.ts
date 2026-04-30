import {
  EdgelessRootBlockComponent,
  EdgelessRootPreviewBlockComponent,
  PageRootBlockComponent,
  PreviewRootBlockComponent,
} from './index.js';

export function effects() {
  // Register components by category
  registerRootComponents();
}

function registerRootComponents() {
  customElements.define('linvo-page-root', PageRootBlockComponent);
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
    'linvo-page-root': PageRootBlockComponent;
  }
}
