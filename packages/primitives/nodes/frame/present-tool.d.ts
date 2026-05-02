import { BaseTool } from '@linvo-core/std/gfx';
import type { NavigatorMode } from './frame-manager';
export type PresentToolOption = {
    mode?: NavigatorMode;
    restoredAfterPan?: boolean;
};
export declare class PresentTool extends BaseTool<PresentToolOption> {
    static toolName: string;
}
