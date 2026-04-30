import { createEmbedBlockHtmlAdapterMatcher } from '@linvo/linvo-block-embed';
import { BookmarkBlockSchema } from '@linvo/linvo-model';
import { BlockHtmlAdapterExtension } from '@linvo/linvo-shared/adapters';

export const bookmarkBlockHtmlAdapterMatcher =
  createEmbedBlockHtmlAdapterMatcher(BookmarkBlockSchema.model.flavour);

export const BookmarkBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  bookmarkBlockHtmlAdapterMatcher
);
