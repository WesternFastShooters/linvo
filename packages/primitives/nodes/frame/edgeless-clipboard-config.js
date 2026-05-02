import { EdgelessClipboardConfig, } from '@linvo-core/block-surface';
import { fromJSON } from '@linvo-core/store';
export class EdgelessClipboardFrameConfig extends EdgelessClipboardConfig {
    static { this.key = 'linvo:frame'; }
    createBlock(frame, context) {
        if (!this.surface)
            return null;
        const { oldToNewIdMap, newPresentationIndexes } = context;
        const { xywh, title, background, childElementIds } = frame.props;
        const newChildElementIds = {};
        if (typeof childElementIds === 'object' && childElementIds !== null) {
            Object.keys(childElementIds).forEach(oldId => {
                const newId = oldToNewIdMap.get(oldId);
                if (newId) {
                    newChildElementIds[newId] = true;
                }
            });
        }
        const frameId = this.crud.addBlock('linvo:frame', {
            xywh,
            background,
            title: fromJSON(title),
            childElementIds: newChildElementIds,
            presentationIndex: newPresentationIndexes.get(frame.id),
        }, this.surface.model.id);
        return frameId;
    }
}
