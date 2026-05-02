import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';
export declare class EdgelessClipboardAttachmentConfig extends EdgelessClipboardConfig {
    static readonly key = "linvo:attachment";
    createBlock(attachment: BlockSnapshot): Promise<string | null>;
}
