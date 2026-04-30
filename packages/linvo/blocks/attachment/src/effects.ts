import { AttachmentBlockComponent } from './attachment-block';
import { AttachmentEdgelessBlockComponent } from './attachment-edgeless-block';

export function effects() {
  customElements.define(
    'linvo-edgeless-attachment',
    AttachmentEdgelessBlockComponent
  );
  customElements.define('linvo-attachment', AttachmentBlockComponent);
}
