import { insertEmbedCard } from '@linvo/linvo-block-embed';
import type { EmbedCardStyle, ReferenceParams } from '@linvo/linvo-model';
import type { Command } from '@linvo/std';

export const insertEmbedSyncedDocCommand: Command<
  {
    docId: string;
    params?: ReferenceParams;
  },
  { blockId: string }
> = (ctx, next) => {
  const { docId, params, std } = ctx;
  const flavour = 'linvo:embed-synced-doc';
  const targetStyle: EmbedCardStyle = 'syncedDoc';
  const props: Record<string, unknown> = { pageId: docId };
  if (params) props.params = params;
  const blockId = insertEmbedCard(std, { flavour, targetStyle, props });
  if (!blockId) return;
  next({ blockId });
};
