import type { Command } from '@linvo-core/std';
type WhiteboardInsertedLinkType = {
    flavour: 'linvo:embed-iframe';
} | null;
export declare const insertWhiteboardWebEmbedByQuickSearchCommand: Command<{}, {
    insertedLinkType: Promise<WhiteboardInsertedLinkType>;
}>;
export {};
