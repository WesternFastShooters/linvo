import type { ExtensionType } from '@linvo-core/store';

import { AttachmentBlockMarkdownAdapterExtension } from './markdown';
import { AttachmentBlockNotionHtmlAdapterExtension } from './notion-html';

export const AttachmentBlockAdapterExtensions: ExtensionType[] = [
  AttachmentBlockNotionHtmlAdapterExtension,
  AttachmentBlockMarkdownAdapterExtension,
];
