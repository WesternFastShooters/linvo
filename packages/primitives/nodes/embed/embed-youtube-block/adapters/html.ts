import { EmbedYoutubeBlockSchema } from '@linvo-core/content';
import {
  BlockHtmlAdapterExtension,
  HastUtils,
} from '@linvo-core/shared/adapters';
import { nanoid } from '@linvo-core/store';

import { createEmbedBlockHtmlAdapterMatcher } from '../../embed-shared/adapters/html';

export const embedYoutubeBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(EmbedYoutubeBlockSchema.model.flavour, {
    toMatch: o => HastUtils.isElement(o.node) && o.node.tagName === 'iframe',
    toBlockSnapshot: {
      enter: (o, context) => {
        if (!HastUtils.isElement(o.node)) {
          return;
        }

        const src = o.node.properties?.src;
        if (typeof src !== 'string') {
          return;
        }

        const { walkerContext } = context;
        if (src.startsWith('https://www.youtube.com/embed/')) {
          const videoId = src.substring(
            'https://www.youtube.com/embed/'.length,
            src.indexOf('?') !== -1 ? src.indexOf('?') : undefined
          );
          walkerContext
            .openNode(
              {
                type: 'block',
                id: nanoid(),
                flavour: 'linvo:embed-youtube',
                props: {
                  url: `https://www.youtube.com/watch?v=${videoId}`,
                },
                children: [],
              },
              'children'
            )
            .closeNode();
        }
      },
    },
  });

export const EmbedYoutubeBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  embedYoutubeBlockHtmlAdapterMatcher
);
