import { defineCustomElement } from '@linvo-core/global/utils';
import { ImageBlockFallbackCard } from './components/image-block-fallback';
import { ImageBlockPageComponent } from './components/page-image-block';
import { ImageBlockComponent } from './image-block';
import { ImageEdgelessBlockComponent } from './image-edgeless-block';
import { ImageEdgelessPlaceholderBlockComponent } from './preview-image/edgeless';
import { ImagePlaceholderBlockComponent } from './preview-image/page';

export function effects() {
  defineCustomElement('linvo-image', ImageBlockComponent);
  defineCustomElement('linvo-edgeless-image', ImageEdgelessBlockComponent);
  defineCustomElement('linvo-page-image', ImageBlockPageComponent);
  defineCustomElement('linvo-image-fallback-card', ImageBlockFallbackCard);
  defineCustomElement(
    'linvo-placeholder-preview-image',
    ImagePlaceholderBlockComponent
  );
  defineCustomElement(
    'linvo-edgeless-placeholder-preview-image',
    ImageEdgelessPlaceholderBlockComponent
  );
}
