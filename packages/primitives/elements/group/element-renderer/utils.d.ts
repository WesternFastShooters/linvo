import type { GroupElementModel } from '@linvo-core/content';
import { Bound } from '@linvo-core/global/gfx';
export declare function titleRenderParams(group: GroupElementModel, zoom: number): {
    font: string;
    bound: Bound;
    text: string;
    titleWidth: number;
    titleHeight: number;
    offset: number;
    lineHeight: number;
    padding: number[];
    titleBound: Bound;
};
export declare function titleBound(group: GroupElementModel, zoom: number): Bound;
