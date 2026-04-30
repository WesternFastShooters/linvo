import { toGfxBlockComponent } from '@linvo/std';
import { css } from 'lit';

import { ImagePlaceholderBlockComponent } from './page.js';

export class ImageEdgelessPlaceholderBlockComponent extends toGfxBlockComponent(
  ImagePlaceholderBlockComponent
) {
  static override styles = css`
    linvo-edgeless-placeholder-preview-image
      .linvo-placeholder-preview-container {
      border: 1px solid var(--linvo-background-tertiary-color);
    }
  `;

  override renderGfxBlock(): unknown {
    return super.renderGfxBlock();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-edgeless-placeholder-preview-image': ImageEdgelessPlaceholderBlockComponent;
  }
}
