import { ShapeElementModel } from '@linvo-core/content';
import { GfxElementModelView, GfxViewInteractionExtension, } from '@linvo-core/std/gfx';
import { normalizeShapeBound } from './element-renderer';
import { mountShapeTextEditor } from './text/edgeless-shape-text-editor';
export class ShapeElementView extends GfxElementModelView {
    static { this.type = 'shape'; }
    onCreated() {
        super.onCreated();
        this._initDblClickToEdit();
    }
    _initDblClickToEdit() {
        this.on('dblclick', () => {
            const edgeless = this.std.view.getBlock(this.std.store.root.id);
            if (edgeless &&
                !this.model.isLocked() &&
                this.model instanceof ShapeElementModel) {
                mountShapeTextEditor(this.model, edgeless);
            }
        });
    }
}
export const ShapeViewInteraction = GfxViewInteractionExtension(ShapeElementView.type, {
    handleResize: () => {
        return {
            onResizeMove({ newBound, model }) {
                const normalizedBound = normalizeShapeBound(model, newBound);
                model.xywh = normalizedBound.serialize();
            },
        };
    },
});
