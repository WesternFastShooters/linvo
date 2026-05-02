import type { EdgelessRootBlockComponent } from '@linvo-core/block-root/edgeless-block';
import type { MermaidInsertPlan, MermaidPreviewModel, MermaidRenderResult } from './types';
type MermaidState = {
    open: boolean;
    code: string;
    rendering: boolean;
    error: string | null;
    renderResult: MermaidRenderResult | null;
    plan: MermaidInsertPlan | null;
    preview: MermaidPreviewModel | null;
};
export declare class MermaidInsertController {
    readonly state: {
        open: import("@preact/signals-core").Signal<boolean>;
        code: import("@preact/signals-core").Signal<string>;
        rendering: import("@preact/signals-core").Signal<boolean>;
        error: import("@preact/signals-core").Signal<string | null>;
        renderResult: import("@preact/signals-core").Signal<MermaidRenderResult | null>;
        plan: import("@preact/signals-core").Signal<MermaidInsertPlan | null>;
        preview: import("@preact/signals-core").Signal<MermaidPreviewModel | null>;
    };
    readonly canInsert: import("@preact/signals-core").ReadonlySignal<boolean>;
    private currentEdgeless;
    private modal;
    private renderToken;
    constructor();
    attach(edgeless: EdgelessRootBlockComponent): void;
    close(): void;
    open(edgeless: EdgelessRootBlockComponent): void;
    renderCurrentCode(): Promise<void>;
    startPlacement(): void;
    updateCode(code: string): void;
    private ensureModal;
    snapshot(): MermaidState;
}
export declare function getMermaidInsertController(edgeless: EdgelessRootBlockComponent): MermaidInsertController;
export {};
