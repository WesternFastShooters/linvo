import { InteractivityExtension } from '@linvo-core/std/gfx';
import { type EdgelessFrameManager, type FrameOverlay } from './frame-manager';
export declare class FrameHighlightManager extends InteractivityExtension {
    static key: string;
    get frameMgr(): EdgelessFrameManager;
    get frameHighlightOverlay(): FrameOverlay;
    mounted(): void;
}
