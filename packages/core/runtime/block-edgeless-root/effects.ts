import { defineCustomElement } from '@linvo-core/global/utils';
import {
  EdgelessRootBlockComponent,
} from './edgeless/edgeless-root-block';
import { EdgelessRootPreviewBlockComponent } from './preview/edgeless-root-preview-block';
import { PreviewRootBlockComponent } from './preview/preview-root-block';

export function effects() {
  // Register components by category
  registerRootComponents();
}

function registerRootComponents() {
  defineCustomElement('linvo-preview-root', PreviewRootBlockComponent);
  defineCustomElement('linvo-edgeless-root', EdgelessRootBlockComponent);
  defineCustomElement(
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
