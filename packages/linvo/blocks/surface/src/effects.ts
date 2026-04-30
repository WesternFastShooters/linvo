import { SurfaceBlockComponent } from './surface-block.js';
import { SurfaceBlockVoidComponent } from './surface-block-void.js';

export function effects() {
  customElements.define('linvo-surface-void', SurfaceBlockVoidComponent);
  customElements.define('linvo-surface', SurfaceBlockComponent);
}
