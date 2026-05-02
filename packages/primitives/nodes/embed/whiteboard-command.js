import { QuickSearchProvider } from '@linvo-core/shared/services';
import { insertEmbedIframeWithUrlCommand } from './embed-iframe-block/commands/insert-embed-iframe-with-url';
export const insertWhiteboardWebEmbedByQuickSearchCommand = (ctx, next) => {
    const { std } = ctx;
    const quickSearchService = std.getOptional(QuickSearchProvider);
    if (!quickSearchService) {
        return;
    }
    const insertedLinkType = quickSearchService.openQuickSearch().then(result => {
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
