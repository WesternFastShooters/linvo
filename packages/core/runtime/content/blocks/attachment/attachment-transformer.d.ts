import type { BlockSnapshotLeaf, FromSnapshotPayload, SnapshotNode, ToSnapshotPayload } from '@linvo-core/store';
import { BaseBlockTransformer } from '@linvo-core/store';
import type { AttachmentBlockProps } from './attachment-model';
export declare class AttachmentBlockTransformer extends BaseBlockTransformer<AttachmentBlockProps> {
    fromSnapshot(payload: FromSnapshotPayload): Promise<SnapshotNode<AttachmentBlockProps>>;
    toSnapshot(snapshot: ToSnapshotPayload<AttachmentBlockProps>): BlockSnapshotLeaf;
}
