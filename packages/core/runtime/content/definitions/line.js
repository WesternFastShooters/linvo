import { z } from 'zod';
import { createEnumMap } from '../helpers/enum';
export var LineWidth;
(function (LineWidth) {
    LineWidth[LineWidth["Two"] = 2] = "Two";
    // Thin
    LineWidth[LineWidth["Four"] = 4] = "Four";
    LineWidth[LineWidth["Six"] = 6] = "Six";
    LineWidth[LineWidth["Eight"] = 8] = "Eight";
    // Thick
    LineWidth[LineWidth["Ten"] = 10] = "Ten";
    LineWidth[LineWidth["Twelve"] = 12] = "Twelve";
})(LineWidth || (LineWidth = {}));
export const BRUSH_LINE_WIDTHS = [
    LineWidth.Two,
    LineWidth.Four,
    LineWidth.Six,
    LineWidth.Eight,
    LineWidth.Ten,
    LineWidth.Twelve,
];
export const HIGHLIGHTER_LINE_WIDTHS = [10, 14, 18, 22, 26, 30];
export const DEFAULT_HIGHLIGHTER_LINE_WIDTH = 22;
/**
 * Use `DefaultTheme.StrokeColorShortMap` instead.
 *
 * @deprecated
 */
export var LineColor;
(function (LineColor) {
    LineColor["Black"] = "--linvo-palette-line-black";
    LineColor["Blue"] = "--linvo-palette-line-blue";
    LineColor["Green"] = "--linvo-palette-line-green";
    LineColor["Grey"] = "--linvo-palette-line-grey";
    LineColor["Magenta"] = "--linvo-palette-line-magenta";
    LineColor["Orange"] = "--linvo-palette-line-orange";
    LineColor["Purple"] = "--linvo-palette-line-purple";
    LineColor["Red"] = "--linvo-palette-line-red";
    LineColor["Teal"] = "--linvo-palette-line-teal";
    LineColor["White"] = "--linvo-palette-line-white";
    LineColor["Yellow"] = "--linvo-palette-line-yellow";
})(LineColor || (LineColor = {}));
export const LineColorMap = createEnumMap(LineColor);
/**
 * Use `DefaultTheme.StrokeColorShortPalettes` instead.
 *
 * @deprecated
 */
export const LINE_COLORS = [
    LineColor.Yellow,
    LineColor.Orange,
    LineColor.Red,
    LineColor.Magenta,
    LineColor.Purple,
    LineColor.Blue,
    LineColor.Teal,
    LineColor.Green,
    LineColor.Black,
    LineColor.Grey,
    LineColor.White,
];
export const LineColorsSchema = z.nativeEnum(LineColor);
