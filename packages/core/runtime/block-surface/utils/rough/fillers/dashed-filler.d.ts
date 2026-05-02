import type { OpSet, ResolvedOptions } from '../core';
import type { Point } from '../geometry';
import type { PatternFiller, RenderHelper } from './filler-interface';
export declare class DashedFiller implements PatternFiller {
    private readonly helper;
    constructor(helper: RenderHelper);
    private dashedLine;
    fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
}
