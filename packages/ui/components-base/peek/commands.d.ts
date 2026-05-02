import type { BlockComponent, Command } from '@linvo-core/std';
export declare const getSelectedPeekableBlocksCommand: Command<{
    selectedBlocks: BlockComponent[];
}, {
    selectedPeekableBlocks: BlockComponent[];
}>;
export declare const peekSelectedBlockCommand: Command<{
    selectedBlocks: BlockComponent[];
}>;
