import { QuickSearchProvider } from '@linvo-core/shared/services';
import type { Command } from '@linvo-core/std';

import { insertEmbedIframeWithUrlCommand } from './embed-iframe-block/commands/insert-embed-iframe-with-url';

type WhiteboardInsertedLinkType = {
  flavour: 'linvo:embed-iframe';
} | null;

export const insertWhiteboardWebEmbedByQuickSearchCommand: Command<
  {},
  { insertedLinkType: Promise<WhiteboardInsertedLinkType> }
> = (ctx, next) => {
  const { std } = ctx;
  const quickSearchService = std.getOptional(QuickSearchProvider);
  if (!quickSearchService) {
    return;
  }

  const insertedLinkType: Promise<WhiteboardInsertedLinkType> =
    quickSearchService.openQuickSearch().then(result => {
      if (!result || !('externalUrl' in result)) {
        return null;
      }

      const [success] = std.command.exec(insertEmbedIframeWithUrlCommand, {
        url: result.externalUrl,
      });
      if (!success) {
        return null;
      }

      return {
        flavour: 'linvo:embed-iframe',
      };
    });

  next({ insertedLinkType });
};
