import { insertEmbedCard } from '@linvo/linvo-block-embed';
import type { EmbedCardStyle, ReferenceParams } from '@linvo/linvo-model';
import type { Command } from '@linvo/std';

export type LinkableFlavour =
  | 'linvo:bookmark'
  | 'linvo:embed-linked-doc'
  | 'linvo:embed-synced-doc'
  | 'linvo:embed-iframe'
  | 'linvo:embed-figma'
  | 'linvo:embed-github'
  | 'linvo:embed-loom'
  | 'linvo:embed-youtube';

export type InsertedLinkType = {
  flavour: LinkableFlavour;
} | null;

export const insertEmbedLinkedDocCommand: Command<
  {
    docId: string;
    params?: ReferenceParams;
  },
  { blockId: string }
> = (ctx, next) => {
  const { docId, params, std } = ctx;
  const flavour = 'linvo:embed-linked-doc';
  const targetStyle: EmbedCardStyle = 'vertical';
  const props: Record<string, unknown> = { pageId: docId };
  if (params) props.params = params;
  const blockId = insertEmbedCard(std, { flavour, targetStyle, props });
  if (!blockId) return;
  next({ blockId });
};
