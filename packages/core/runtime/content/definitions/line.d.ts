import { z } from 'zod';
export declare enum LineWidth {
    Two = 2,
    Four = 4,
    Six = 6,
    Eight = 8,
    Ten = 10,
    Twelve = 12
}
export declare const BRUSH_LINE_WIDTHS: LineWidth[];
export declare const HIGHLIGHTER_LINE_WIDTHS: number[];
export declare const DEFAULT_HIGHLIGHTER_LINE_WIDTH = 22;
/**
 * Use `DefaultTheme.StrokeColorShortMap` instead.
 *
 * @deprecated
 */
export declare enum LineColor {
    Black = "--linvo-palette-line-black",
    Blue = "--linvo-palette-line-blue",
    Green = "--linvo-palette-line-green",
    Grey = "--linvo-palette-line-grey",
    Magenta = "--linvo-palette-line-magenta",
    Orange = "--linvo-palette-line-orange",
    Purple = "--linvo-palette-line-purple",
    Red = "--linvo-palette-line-red",
    Teal = "--linvo-palette-line-teal",
    White = "--linvo-palette-line-white",
    Yellow = "--linvo-palette-line-yellow"
}
export declare const LineColorMap: Record<LineColor, "Red" | "Orange" | "Yellow" | "Green" | "Blue" | "Purple" | "Magenta" | "Grey" | "White" | "Black" | "Teal">;
/**
 * Use `DefaultTheme.StrokeColorShortPalettes` instead.
 *
 * @deprecated
 */
export declare const LINE_COLORS: readonly [LineColor.Yellow, LineColor.Orange, LineColor.Red, LineColor.Magenta, LineColor.Purple, LineColor.Blue, LineColor.Teal, LineColor.Green, LineColor.Black, LineColor.Grey, LineColor.White];
export declare const LineColorsSchema: z.ZodNativeEnum<typeof LineColor>;
