import type { OpSet, ResolvedOptions } from '../core';
import type { Point } from '../geometry';
import { HachureFiller } from './hachure-filler';
export declare class ZigZagFiller extends HachureFiller {
    fillPolygons(polygonList: Point[][], o: ResolvedOptions): OpSet;
}
