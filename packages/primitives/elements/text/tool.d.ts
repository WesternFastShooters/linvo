import type { PointerEventState } from '@linvo-core/std';
import { BaseTool } from '@linvo-core/std/gfx';
export declare class TextTool extends BaseTool {
    static toolName: string;
    click(e: PointerEventState): void;
}
