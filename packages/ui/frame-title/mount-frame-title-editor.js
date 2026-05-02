import { DefaultTool } from '@linvo-core/block-surface';
import { LinvoError } from '@linvo-core/global/exceptions';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import { EdgelessFrameTitleEditor } from './edgeless-frame-title-editor';
export function mountFrameTitleEditor(frame, edgeless) {
    const mountElm = edgeless.querySelector('.edgeless-mount-point');
    if (!mountElm) {
        throw new LinvoError(LinvoError.ErrorCode.ValueNotExists, "edgeless block's mount point does not exist");
    }
    const gfx = edgeless.std.get(GfxControllerIdentifier);
    gfx.tool.setTool(DefaultTool);
    gfx.selection.set({
        elements: [frame.id],
        editing: true,
    });
    const frameEditor = new EdgelessFrameTitleEditor();
    frameEditor.frameModel = frame;
    frameEditor.edgeless = edgeless;
    mountElm.append(frameEditor);
}
