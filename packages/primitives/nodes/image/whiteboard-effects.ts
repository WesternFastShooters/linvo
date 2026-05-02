import { defineCustomElement } from '@linvo-core/global/utils';

import { ImageBlockFallbackCard } from './components/image-block-fallback';
import { ImageBlockComponent } from './image-block';
import { ImageEdgelessBlockComponent } from './image-edgeless-block';
import { ImageEdgelessPlaceholderBlockComponent } from './preview-image/edgeless';

export function whiteboardEffects() {
  defineCustomElement('linvo-image', ImageBlockComponent);
  defineCustomElement('linvo-edgeless-image', ImageEdgelessBlockComponent);
  defineCustomElement('linvo-image-fallback-card', ImageBlockFallbackCard);
  defineCustomElement(
    'linvo-edgeless-placeholder-preview-image',
    ImageEdgelessPlaceholderBlockComponent
  );
}
