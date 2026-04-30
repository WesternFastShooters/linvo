import { ImageBlockFallbackCard } from './components/image-block-fallback.js';
import { ImageBlockPageComponent } from './components/page-image-block.js';
import { ImageBlockComponent } from './image-block.js';
import { ImageEdgelessBlockComponent } from './image-edgeless-block.js';
import { ImageEdgelessPlaceholderBlockComponent } from './preview-image/edgeless.js';
import { ImagePlaceholderBlockComponent } from './preview-image/page.js';

export function effects() {
  customElements.define('linvo-image', ImageBlockComponent);
  customElements.define('linvo-edgeless-image', ImageEdgelessBlockComponent);
  customElements.define('linvo-page-image', ImageBlockPageComponent);
  customElements.define('linvo-image-fallback-card', ImageBlockFallbackCard);
  customElements.define(
    'linvo-placeholder-preview-image',
    ImagePlaceholderBlockComponent
  );
  customElements.define(
    'linvo-edgeless-placeholder-preview-image',
    ImageEdgelessPlaceholderBlockComponent
  );
}
