import { Bound, type SerializedXYWH } from '@linvo-core/global/gfx';
import { BoundPlainText, ObservableRecordMap, PlainText } from '@linvo-core/store';
import type { PlainTextLike } from '@linvo-core/store';
import type { LocalElementState } from '@linvo-core/shared/whiteboard/types';
import { LocalStatefulElementModel } from './local-stateful-element-model';
import type { LocalSurfaceModel } from './local-surface-model';
export type ShapeElementState = LocalElementState & {
    fill?: string;
    rotate?: number;
    text?: PlainText;
    xywh: SerializedXYWH;
};
export type TextElementState = LocalElementState & {
    color?: string;
    text: PlainText;
    xywh: SerializedXYWH;
};
export type ConnectorElementEndpoint = {
    id?: string;
    position?: [number, number];
};
export type ConnectorElementState = LocalElementState & {
    source?: ConnectorElementEndpoint;
    target?: ConnectorElementEndpoint;
    text?: PlainText;
    xywh?: SerializedXYWH;
};
export type GroupElementState = LocalElementState & {
    children: Record<string, boolean>;
    title: PlainText;
    xywh: SerializedXYWH;
};
export type MindmapNodeDetail = {
    collapsed?: boolean;
    index: string;
    parent?: string;
    text?: PlainText;
};
export type MindmapElementState = LocalElementState & {
    children: Record<string, MindmapNodeDetail>;
    layoutType?: string;
    style?: string;
    xywh: SerializedXYWH;
};
export type FrameElementState = LocalElementState & {
    background?: string;
    childElementIds: Record<string, boolean>;
    title: PlainText;
    xywh: SerializedXYWH;
};
export declare class OfflineShapeElementModel extends LocalStatefulElementModel<ShapeElementState> {
    get elementBound(): Bound;
    private _getTextBinding;
    accessor fill: string;
    accessor rotate: number;
    get text(): BoundPlainText;
    set text(value: PlainTextLike | string | undefined);
    accessor xywh: SerializedXYWH;
}
export declare class OfflineTextElementModel extends LocalStatefulElementModel<TextElementState> {
    private _getTextBinding;
    accessor color: string;
    get text(): BoundPlainText;
    set text(value: PlainTextLike | string);
    accessor xywh: SerializedXYWH;
}
export declare class OfflineConnectorElementModel extends LocalStatefulElementModel<ConnectorElementState> {
    private _getTextBinding;
    accessor source: ConnectorElementEndpoint | undefined;
    accessor target: ConnectorElementEndpoint | undefined;
    get text(): BoundPlainText;
    set text(value: PlainTextLike | string | undefined);
}
export declare class OfflineGroupElementModel extends LocalStatefulElementModel<GroupElementState> {
    private _getChildrenBinding;
    accessor childIds: string[];
    get children(): ObservableRecordMap<boolean>;
    set children(value: ObservableRecordMap<boolean> | Record<string, boolean>);
    get title(): BoundPlainText;
    set title(value: PlainTextLike | string);
    accessor xywh: SerializedXYWH;
    addChild(id: string): void;
    hasChild(id: string): boolean;
    removeChild(id: string): void;
    setChildIds(ids: string[]): void;
}
export type MindmapTreeNode = {
    children: MindmapTreeNode[];
    detail: MindmapNodeDetail;
    id: string;
};
export declare class OfflineMindmapElementModel extends LocalStatefulElementModel<MindmapElementState> {
    private _getChildrenBinding;
    accessor childIds: string[];
    get children(): ObservableRecordMap<MindmapNodeDetail>;
    set children(value: ObservableRecordMap<MindmapNodeDetail> | Record<string, MindmapNodeDetail>);
    accessor style: string;
    accessor layoutType: string;
    accessor tree: MindmapTreeNode[];
    accessor xywh: SerializedXYWH;
    addNode(id: string, detail: MindmapNodeDetail): void;
    removeNode(id: string): void;
    setChildIds(ids: string[]): void;
    private _rebuildTree;
}
export declare class OfflineFrameElementModel extends LocalStatefulElementModel<FrameElementState> {
    accessor background: string;
    private _getChildrenBinding;
    accessor childIds: string[];
    get childElementIds(): ObservableRecordMap<boolean>;
    set childElementIds(value: ObservableRecordMap<boolean> | Record<string, boolean>);
    get title(): BoundPlainText;
    set title(value: PlainTextLike | string);
    accessor xywh: SerializedXYWH;
    addChild(id: string): void;
    removeChild(id: string): void;
    setChildIds(ids: string[]): void;
}
export declare function registerDefaultElementModels(surface: LocalSurfaceModel): void;
