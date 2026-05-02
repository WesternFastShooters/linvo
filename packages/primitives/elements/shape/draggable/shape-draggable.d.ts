import { EdgelessDraggableElementController } from '@linvo-ui/edgeless-toolbar';
import { LitElement } from 'lit';
import { ShapeTool } from '../shape-tool';
import type { DraggableShape } from './utils';
declare const EdgelessToolbarShapeDraggable_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-ui/edgeless-toolbar").EdgelessToolbarToolClass>;
export declare class EdgelessToolbarShapeDraggable extends EdgelessToolbarShapeDraggable_base {
    static styles: import("lit").CSSResult;
    draggableController: EdgelessDraggableElementController<DraggableShape>;
    draggingShape: DraggableShape['name'];
    type: typeof ShapeTool;
    get crud(): import("@linvo-core/block-surface").EdgelessCRUDExtension;
    get shapeShadow(): "0 0 7px rgba(0, 0, 0, .22)" | "0 0 5px rgba(0, 0, 0, .2)";
    private _setShapeOverlayLock;
    initDragController(): void;
    render(): import("lit-html").TemplateResult<1>;
    updated(_changedProperties: Map<PropertyKey, unknown>): void;
    accessor onShapeClick: (shape: DraggableShape) => void;
    accessor readyToDrop: boolean;
    accessor shapeContainer: HTMLDivElement;
}
export {};
