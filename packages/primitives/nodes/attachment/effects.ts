import { defineCustomElement } from '@linvo-core/global/utils';
import { AttachmentBlockComponent } from './attachment-block';
import { AttachmentEdgelessBlockComponent } from './attachment-edgeless-block';

export function effects() {
  defineCustomElement(
    'linvo-edgeless-attachment',
    AttachmentEdgelessBlockComponent
  );
  defineCustomElement('linvo-attachment', AttachmentBlockComponent);
}
