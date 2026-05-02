import type { EmbedIframeBlockProps } from '@linvo-core/content';
import type { Command } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';

import type { EmbedLinkInputPopupOptions } from '../components/embed-iframe-link-input-popup';
import { EmbedIframeBlockComponent } from '../embed-iframe-block';

export const insertEmptyEmbedIframeCommand: Command<
  {
    place?: 'after' | 'before';
    removeEmptyLine?: boolean;
    selectedModels?: BlockModel[];
    linkInputPopupOptions?: EmbedLinkInputPopupOptions;
  },
  {
    insertedEmbedIframeBlockId: Promise<string>;
  }
> = (ctx, next) => {
  const { selectedModels, place, removeEmptyLine, std, linkInputPopupOptions } =
    ctx;
  if (!selectedModels?.length) return;

  const targetModel =
    place === 'before'
      ? selectedModels[0]
      : selectedModels[selectedModels.length - 1];

  const embedIframeBlockProps: Partial<EmbedIframeBlockProps> & {
    flavour: 'linvo:embed-iframe';
  } = {
    flavour: 'linvo:embed-iframe',
  };

  const result = std.store.addSiblingBlocks(
    targetModel,
    [embedIframeBlockProps],
    place
  );
  if (result.length === 0) return;

  if (removeEmptyLine && targetModel.text?.length === 0) {
    std.store.deleteBlock(targetModel);
  }

  next({
    insertedEmbedIframeBlockId: std.host.updateComplete.then(async () => {
      const blockComponent = std.view.getBlock(result[0]);
      if (blockComponent instanceof EmbedIframeBlockComponent) {
        await blockComponent.updateComplete;
        blockComponent.toggleLinkInputPopup(linkInputPopupOptions);
      }
      return result[0];
    }),
  });
};
