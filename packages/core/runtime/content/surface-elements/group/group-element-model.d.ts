import type { IVec, PointLocation } from '@linvo-core/global/gfx';
import { Bound } from '@linvo-core/global/gfx';
import type { BaseElementProps, GfxModel, SerializedElement } from '@linvo-core/std/gfx';
import { ElementDataMap, GfxGroupLikeElementModel } from '@linvo-core/std/gfx';
import { PlainText } from '@linvo-core/store/reactive/text';
type GroupElementProps = BaseElementProps & {
    children: ElementDataMap;
    title: PlainText;
};
export type SerializedGroupElement = SerializedElement & {
    title: string;
    children: Record<string, boolean>;
};
export declare class GroupElementModel extends GfxGroupLikeElementModel<GroupElementProps> {
    get rotate(): number;
    set rotate(_: number);
    get type(): string;
    static propsToY(props: Record<string, unknown>): GroupElementProps;
    addChild(element: GfxModel): void;
    containsBound(bound: Bound): boolean;
    getLineIntersections(start: IVec, end: IVec): PointLocation[] | null;
    removeChild(element: GfxModel): void;
    serialize(): SerializedGroupElement;
    lock(): void;
    unlock(): void;
    accessor children: ElementDataMap;
    accessor showTitle: boolean;
    accessor title: PlainText;
}
export {};
