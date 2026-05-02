import { SurfaceBlockModel } from '@linvo-core/block-surface';
import { FileDropConfigExtension } from '@linvo-ui/components/drop-indicator';
import { AttachmentBlockSchema } from '@linvo-core/content';
import { TelemetryProvider } from '@linvo-core/shared/services';
import { isInsideEdgelessEditor, matchModels, } from '@linvo-core/shared/utils';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import { addAttachments, addSiblingAttachmentBlocks } from './utils';
export const AttachmentDropOption = FileDropConfigExtension({
    flavour: AttachmentBlockSchema.model.flavour,
    onDrop: ({ files, targetModel, placement, point, std }) => {
        // generic attachment block for all files except images
        const attachmentFiles = files.filter(file => !file.type.startsWith('image/'));
        if (!attachmentFiles.length)
            return false;
        if (targetModel && !matchModels(targetModel, [SurfaceBlockModel])) {
            addSiblingAttachmentBlocks(std, attachmentFiles, targetModel, placement).catch(console.error);
            return true;
        }
        if (isInsideEdgelessEditor(std.host)) {
            const gfx = std.get(GfxControllerIdentifier);
            point = gfx.viewport.toViewCoordFromClientCoord(point);
            addAttachments(std, attachmentFiles, point).catch(console.error);
            std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
                control: 'canvas:drop',
                page: 'whiteboard editor',
                module: 'toolbar',
                segment: 'toolbar',
                type: 'attachment',
            });
            return true;
        }
        return false;
    },
});
