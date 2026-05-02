import type { Op, OpSet, ResolvedOptions } from '../core';
import type { Line, Point } from '../geometry';
import type { PatternFiller, RenderHelper } from './filler-interface';
export declare class HachureFiller implements PatternFiller {
    private readonly helper;
    constructor(helper: RenderHelper);
    protected _fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
    fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
    protected renderLines(lines: Line[], o: ResolvedOptions): Op[];
}
