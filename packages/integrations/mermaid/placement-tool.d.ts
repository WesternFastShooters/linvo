import type { PointerEventState } from '@linvo-core/std';
import { BaseTool } from '@linvo-core/std/gfx';
import type { MermaidInsertController } from './controller';
import type { MermaidInsertPlan, MermaidRenderResult } from './types';
type MermaidPlacementOptions = {
    controller: MermaidInsertController;
    plan: MermaidInsertPlan;
    renderResult: MermaidRenderResult;
    overlaySvg: string;
    overlayWidth: number;
    overlayHeight: number;
};
type MermaidCommitContext = Pick<MermaidPlacementTool, 'doc' | 'gfx' | 'std'>;
export declare class MermaidPlacementTool extends BaseTool<MermaidPlacementOptions> {
    static toolName: string;
    private overlay;
    private escapeHandler;
    private get surfaceComponent();
    activate(options: MermaidPlacementOptions): void;
    deactivate(): void;
    pointerMove(event: PointerEventState): void;
    click(event: PointerEventState): Promise<void>;
}
export declare function commitMermaidPlan(context: MermaidCommitContext, plan: MermaidInsertPlan, renderResult: MermaidRenderResult, anchor: [number, number]): Promise<void>;
export {};
