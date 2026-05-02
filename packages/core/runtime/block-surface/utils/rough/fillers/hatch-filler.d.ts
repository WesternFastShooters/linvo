import type { OpSet, ResolvedOptions } from '../core';
import type { Point } from '../geometry';
import { HachureFiller } from './hachure-filler';
export declare class HatchFiller extends HachureFiller {
    fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
}
