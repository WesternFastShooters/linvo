import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import {} from '@linvo-core/store';
export class EdgelessClipboardAttachmentConfig extends EdgelessClipboardConfig {
    static { this.key = 'linvo:attachment'; }
    async createBlock(attachment) {
        if (!this.surface)
            return null;
        const { xywh, rotate, sourceId, name, size, type, embed, style } = attachment.props;
        if (!(await this.std.docSource.blobSync.get(sourceId))) {
            return null;
        }
        const attachmentId = this.crud.addBlock('linvo:attachment', {
            xywh,
            rotate,
            sourceId,
            name,
            size,
            type,
            embed,
            style,
        }, this.surface.model.id);
        return attachmentId;
    }
}
