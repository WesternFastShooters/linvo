import { type ShapeName } from '@linvo-core/content';
import type { BlockComponent } from '@linvo-core/std';
import { LitElement } from 'lit';
declare const EdgelessShapeMenu_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessShapeMenu extends EdgelessShapeMenu_base {
    private _morePanel;
    static styles: import("lit").CSSResult;
    private readonly _shapeName$;
    accessor edgeless: BlockComponent;
    private readonly _props$;
    private readonly _setFillColor;
    private readonly _setShapeStyle;
    private readonly _theme$;
    accessor showMorePanel: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(): void;
    private _disposeMorePanel;
    private _syncMorePanel;
    render(): import("lit-html").TemplateResult<1>;
    accessor onChange: (name: ShapeName) => void;
}
export {};
