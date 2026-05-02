import { type ClipboardConfigCreationContext, EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';
export declare class EdgelessClipboardFrameConfig extends EdgelessClipboardConfig {
    static readonly key = "linvo:frame";
    createBlock(frame: BlockSnapshot, context: ClipboardConfigCreationContext): string | null;
}
