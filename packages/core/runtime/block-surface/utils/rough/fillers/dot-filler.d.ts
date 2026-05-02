import type { OpSet, ResolvedOptions } from '../core';
import type { Point } from '../geometry';
import type { PatternFiller, RenderHelper } from './filler-interface';
export declare class DotFiller implements PatternFiller {
    private readonly helper;
    constructor(helper: RenderHelper);
    private dotsOnLines;
    fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
}
