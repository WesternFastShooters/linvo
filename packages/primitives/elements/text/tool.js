import { DefaultTool } from '@linvo-core/block-surface';
import { TelemetryProvider } from '@linvo-core/shared/services';
import { Bound } from '@linvo-core/global/gfx';
import { BaseTool } from '@linvo-core/std/gfx';
import { mountTextElementEditor } from './edgeless-text-editor';
import { createSurfaceText } from './surface-text';
function addText(gfx, event) {
    const [x, y] = gfx.viewport.toModelCoord(event.x, event.y);
    const selected = gfx.getElementByPoint(x, y);
    if (!selected) {
        const [modelX, modelY] = gfx.viewport.toModelCoord(event.x, event.y);
        if (!gfx.surface) {
            return;
        }
        const id = gfx.surface.addElement({
            type: 'text',
            xywh: new Bound(modelX, modelY, 32, 32).serialize(),
            text: createSurfaceText(),
        });
        gfx.doc.captureSync();
        const textElement = gfx.getElementById(id);
        const edgelessView = gfx.std.view.getBlock(gfx.std.store.root.id);
        if (!edgelessView) {
            console.error('edgeless view is not found.');
            return;
        }
        mountTextElementEditor(textElement, edgelessView);
    }
}
export class TextTool extends BaseTool {
    static { this.toolName = 'text'; }
    click(e) {
        addText(this.gfx, e);
        this.gfx.tool.setTool(DefaultTool);
        this.gfx.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
            control: 'canvas:draw',
            page: 'whiteboard editor',
            module: 'toolbar',
            segment: 'toolbar',
            type: 'text',
        });
    }
}
