import type { BlockSnapshotLeaf, FromSnapshotPayload, SnapshotNode, ToSnapshotPayload } from '@linvo-core/store';
import { BaseBlockTransformer } from '@linvo-core/store';
import type { ImageBlockProps } from './image-model';
export declare class ImageBlockTransformer extends BaseBlockTransformer<ImageBlockProps> {
    fromSnapshot(payload: FromSnapshotPayload): Promise<SnapshotNode<ImageBlockProps>>;
    toSnapshot(snapshot: ToSnapshotPayload<ImageBlockProps>): BlockSnapshotLeaf;
}
