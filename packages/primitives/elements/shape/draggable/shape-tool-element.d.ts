import { type ShapeName, type ShapeStyle } from '@linvo-core/content';
import type { BlockComponent } from '@linvo-core/std';
import { LitElement, type PropertyValues, type TemplateResult } from 'lit';
interface Shape {
    name: ShapeName;
    svg: TemplateResult<1>;
}
declare const EdgelessShapeToolElement_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessShapeToolElement extends EdgelessShapeToolElement_base {
    static styles: import("lit").CSSResult;
    get crud(): import("@linvo-core/block-surface").EdgelessCRUDExtension;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    private readonly _addShape;
    private readonly _onDragEnd;
    private readonly _onDragMove;
    private readonly _onDragStart;
    private readonly _onMouseMove;
    private readonly _onMouseUp;
    private readonly _onTouchEnd;
    private readonly _touchMove;
    private readonly _transformMap;
    connectedCallback(): void;
    render(): TemplateResult<1>;
    updated(changedProperties: PropertyValues<this>): void;
    private accessor _backupShapeElement;
    private accessor _dragging;
    private accessor _isOutside;
    private accessor _shapeElement;
    private accessor _startCoord;
    accessor edgeless: BlockComponent;
    accessor getContainerRect: () => DOMRect;
    accessor handleClick: () => void;
    accessor order: number;
    accessor shape: Shape;
    accessor shapeStyle: ShapeStyle;
    accessor shapeType: ShapeName;
}
export {};
