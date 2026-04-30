import { createEmbedBlockPlainTextAdapterMatcher } from '@linvo/linvo-block-embed';
import { BookmarkBlockSchema } from '@linvo/linvo-model';
import { BlockPlainTextAdapterExtension } from '@linvo/linvo-shared/adapters';

export const bookmarkBlockPlainTextAdapterMatcher =
  createEmbedBlockPlainTextAdapterMatcher(BookmarkBlockSchema.model.flavour);

export const BookmarkBlockPlainTextAdapterExtension =
  BlockPlainTextAdapterExtension(bookmarkBlockPlainTextAdapterMatcher);
