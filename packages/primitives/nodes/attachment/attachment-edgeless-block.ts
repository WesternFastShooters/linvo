import { EdgelessLegacySlotIdentifier } from '@linvo-core/block-surface';
import {
  AttachmentBlockSchema,
  AttachmentBlockStyles,
} from '@linvo-core/content';
import {
  EMBED_CARD_HEIGHT,
  EMBED_CARD_WIDTH,
} from '@linvo-core/shared/consts';
import { toGfxBlockComponent } from '@linvo-core/std';
import { GfxViewInteractionExtension } from '@linvo-core/std/gfx';
import { styleMap } from 'lit/directives/style-map.js';

import { AttachmentBlockComponent } from './attachment-block';

export class AttachmentEdgelessBlockComponent extends toGfxBlockComponent(
  AttachmentBlockComponent
) {
  override blockDraggable = false;

  get slots() {
    return this.std.get(EdgelessLegacySlotIdentifier);
  }

  override onClick(_: MouseEvent) {
    return;
  }

  override renderGfxBlock() {
    const { style$ } = this.model.props;
    const cardStyle = style$.value ?? AttachmentBlockStyles[1];
    const width = EMBED_CARD_WIDTH[cardStyle];
    const height = EMBED_CARD_HEIGHT[cardStyle];
    const bound = this.model.elementBound;
    const scaleX = bound.w / width;
    const scaleY = bound.h / height;

    this.containerStyleMap = styleMap({
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: '0 0',
      overflow: 'hidden',
    });

    return this.renderPageContent();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-edgeless-attachment': AttachmentEdgelessBlockComponent;
  }
}

export const AttachmentBlockInteraction = GfxViewInteractionExtension(
  AttachmentBlockSchema.model.flavour,
  {
    resizeConstraint: {
      lockRatio: true,
    },
    handleRotate: () => {
      return {
        beforeRotate: context => {
          context.set({
            rotatable: false,
          });
        },
      };
    },
  }
);
