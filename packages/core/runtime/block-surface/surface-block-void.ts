import { BlockComponent } from '@linvo-core/std';
import { nothing } from 'lit';

import type { SurfaceBlockModel } from './surface-model';

export class SurfaceBlockVoidComponent extends BlockComponent<SurfaceBlockModel> {
  override render() {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-surface-void': SurfaceBlockVoidComponent;
  }
}
