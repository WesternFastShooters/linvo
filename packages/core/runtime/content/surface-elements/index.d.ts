import type { BrushElementModel } from './brush';
import type { ConnectorElementModel } from './connector';
import type { GroupElementModel } from './group';
import type { HighlighterElementModel } from './highlighter';
import type { MindmapElementModel } from './mindmap';
import type { ShapeElementModel } from './shape';
import type { TextElementModel } from './text';
export * from './brush';
export * from './connector';
export * from './group';
export * from './highlighter';
export * from './mindmap';
export * from './shape';
export * from './text';
export type SurfaceElementModelMap = {
    brush: BrushElementModel;
    highlighter: HighlighterElementModel;
    connector: ConnectorElementModel;
    group: GroupElementModel;
    mindmap: MindmapElementModel;
    shape: ShapeElementModel;
    text: TextElementModel;
};
export type SurfaceTextModelMap = {
    text: TextElementModel;
    connector: ConnectorElementModel;
    shape: ShapeElementModel;
};
export type SurfaceTextModel = SurfaceTextModelMap[keyof SurfaceTextModelMap];
