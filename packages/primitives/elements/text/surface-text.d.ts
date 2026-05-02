import type { EditableTextLike } from '@linvo-core/store/reactive/text';
import { PlainTextEditor } from './plain-text-editor';
import { SURFACE_TEXT_UNIQ_IDENTIFIER } from '@linvo-core/std/gfx';
export type SurfaceTextDelta = {
    attributes?: Record<string, unknown>;
    insert: string;
};
export type SurfaceTextLike = {
    length: number;
    toDelta(): SurfaceTextDelta[];
    toString(): string;
};
type ObservableSurfaceTextLike = SurfaceTextLike & {
    delete?(index: number, length: number): void;
    insert?(index: number, text: string): void;
    observe?(listener: (...args: unknown[]) => void): (() => void) | void;
    set?(text: string, local?: boolean): void;
    unobserve?(listener: (...args: unknown[]) => void): void;
};
export type SurfaceTextSnapshot = {
    [SURFACE_TEXT_UNIQ_IDENTIFIER]: true;
    delta: SurfaceTextDelta[];
};
export declare function bindSurfaceText(text: ObservableSurfaceTextLike | null | undefined): EditableTextLike | null;
export declare function createSurfaceText(text?: string): SurfaceTextSnapshot;
export { PlainTextEditor };
