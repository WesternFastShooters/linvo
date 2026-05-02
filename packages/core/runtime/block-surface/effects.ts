import { defineCustomElement } from '@linvo-core/global/utils';
import { SurfaceBlockComponent } from './surface-block';
import { SurfaceBlockVoidComponent } from './surface-block-void';

export function effects() {
  defineCustomElement('linvo-surface-void', SurfaceBlockVoidComponent);
  defineCustomElement('linvo-surface', SurfaceBlockComponent);
}
