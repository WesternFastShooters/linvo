import { type LinvoThemeKeyV2 } from '@theme/v2';
import type { Color } from './color';
import type { Palette } from './types';
export declare function buildPalettes(obj: Record<string, Color>, prefix?: string): Palette[];
export declare function getColorByKey(key: LinvoThemeKeyV2): Color;
export declare const pureBlack: string;
export declare const pureWhite: string;
