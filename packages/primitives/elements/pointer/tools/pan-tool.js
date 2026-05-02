import { EdgelessLegacySlotIdentifier } from '@linvo-core/block-surface';
import { on } from '@linvo-core/shared/utils';
import { BaseTool, MouseButton } from '@linvo-core/std/gfx';
import { Signal } from '@preact/signals-core';
export class PanTool extends BaseTool {
    constructor() {
        super(...arguments);
        this._lastPoint = null;
        this.panning$ = new Signal(false);
    }
    static { this.toolName = 'pan'; }
    get allowDragWithRightButton() {
        return true;
    }
    dragEnd(_) {
        this._lastPoint = null;
        this.panning$.value = false;
    }
    dragMove(e) {
        if (!this._lastPoint)
            return;
        const { viewport } = this.gfx;
        const { zoom } = viewport;
        const [lastX, lastY] = this._lastPoint;
        const deltaX = lastX - e.x;
        const deltaY = lastY - e.y;
        this._lastPoint = [e.x, e.y];
        viewport.applyDeltaCenter(deltaX / zoom, deltaY / zoom);
    }
    dragStart(e) {
        this._lastPoint = [e.x, e.y];
        this.panning$.value = true;
    }
    mounted() {
        this.addHook('pointerDown', evt => {
            const shouldPanWithMiddle = evt.raw.button === MouseButton.MIDDLE;
            if (!shouldPanWithMiddle) {
                return;
            }
            evt.raw.preventDefault();
            const currentTool = this.controller.currentToolOption$.peek();
            const restoreToPrevious = () => {
                const { toolType, options: originalToolOptions } = currentTool;
                const selectionToRestore = this.gfx.selection.surfaceSelections;
                if (!toolType)
                    return;
                let finalOptions = originalToolOptions;
                const PRESENT_TOOL_NAME = 'frameNavigator';
                if (toolType.toolName === PRESENT_TOOL_NAME) {
                    // When restoring PresentTool (frameNavigator) after a temporary pan (e.g., via middle mouse button),
                    // set 'restoredAfterPan' to true. This allows PresentTool to avoid an unwanted viewport reset
                    // and maintain the panned position.
                    const currentPresentOptions = originalToolOptions;
                    finalOptions = {
                        ...currentPresentOptions,
                        restoredAfterPan: true,
                    };
                }
                this.controller.setTool(toolType, finalOptions);
                this.gfx.selection.set(selectionToRestore);
            };
            // If in presentation mode, disable black background after middle mouse drag
            if (currentTool.toolType?.toolName === 'frameNavigator') {
                const slots = this.std.get(EdgelessLegacySlotIdentifier);
                slots.navigatorSettingUpdated.next({
                    blackBackground: false,
                });
            }
            this.controller.setTool(PanTool, {
                panning: true,
            });
            const dispose = on(document, 'pointerup', evt => {
                if (evt.button === MouseButton.MIDDLE) {
                    restoreToPrevious();
                    dispose();
                }
            });
            return false;
        });
    }
}
