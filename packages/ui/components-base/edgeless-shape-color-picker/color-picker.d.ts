import { type Color, type ColorScheme, type LineWidth, type Palette, type ShapeProps, type StrokeStyle } from '@linvo-core/content';
import { LitElement } from 'lit';
import type { EditorMenuButton } from '../toolbar';
type TabType = 'normal' | 'custom';
type ColorType = Extract<keyof ShapeProps, 'fillColor' | 'strokeColor'>;
declare const EdgelessShapeColorPicker_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessShapeColorPicker extends EdgelessShapeColorPicker_base {
    #private;
    static styles: import("lit").CSSResult;
    tabType$: import("@preact/signals-core").Signal<TabType>;
    colorType$: import("@preact/signals-core").Signal<ColorType>;
    get fillColorWithoutAlpha(): string;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
    accessor payload: {
        fillColor: string;
        strokeColor: string;
        strokeWidth: LineWidth;
        strokeStyle: StrokeStyle;
        originalFillColor: Color;
        originalStrokeColor: Color;
        theme: ColorScheme;
        enableCustomColor: boolean;
    };
    accessor palettes: Palette[];
    accessor menuButton: EditorMenuButton;
}
export {};
