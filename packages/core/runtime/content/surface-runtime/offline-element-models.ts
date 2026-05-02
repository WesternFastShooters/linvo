import { Bound, type SerializedXYWH } from '@linvo-core/global/gfx';
import {
  BoundPlainText,
  ObservableRecordMap,
  PlainText,
} from '@linvo-core/store';
import type { PlainTextLike } from '@linvo-core/store';
import type { LocalElementState } from '@linvo-core/shared/whiteboard/types';
import { field, local, watch } from './field-decorators';
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

function toPlainText(value: PlainTextLike | string | undefined, fallback = '') {
  if (typeof value === 'string') {
    return new PlainText(value);
  }

  if (value) {
    return new PlainText(value.toString());
  }

  return new PlainText(fallback);
}

function toRecordValue<V>(
  value: ObservableRecordMap<V> | Record<string, V> | undefined
) {
  if (value instanceof ObservableRecordMap) {
    return value.toJSON();
  }

  return value ?? {};
}

export class OfflineShapeElementModel extends LocalStatefulElementModel<ShapeElementState> {
  get elementBound() {
    return Bound.deserialize(this.xywh);
  }

  private _getTextBinding(key: string) {
    const cacheKey = `${key}:binding`;
    const current = this._readField<PlainText | undefined>(key);
    const nextText = current?.toString() ?? '';
    let binding = this._local.get(cacheKey) as BoundPlainText | undefined;

    if (!binding) {
      binding = new BoundPlainText(nextText, value => {
        this._writeField(key, new PlainText(value));
      });
      this._local.set(cacheKey, binding);
      return binding;
    }

    binding.sync(nextText, false);
    return binding;
  }

  @field('transparent')
  accessor fill = 'transparent';

  @field(0)
  accessor rotate = 0;

  get text(): BoundPlainText {
    return this._getTextBinding('text');
  }

  set text(value: PlainTextLike | string | undefined) {
    const next = toPlainText(value);
    this._writeField('text', next);
    this._getTextBinding('text').sync(next.toString());
  }

  @field('[0,0,100,100]' as SerializedXYWH)
  accessor xywh: SerializedXYWH = '[0,0,100,100]';
}

export class OfflineTextElementModel extends LocalStatefulElementModel<TextElementState> {
  private _getTextBinding(key: string) {
    const cacheKey = `${key}:binding`;
    const current = this._readField<PlainText>(key, new PlainText());
    const nextText = current?.toString() ?? '';
    let binding = this._local.get(cacheKey) as BoundPlainText | undefined;

    if (!binding) {
      binding = new BoundPlainText(nextText, value => {
        this._writeField(key, new PlainText(value));
      });
      this._local.set(cacheKey, binding);
      return binding;
    }

    binding.sync(nextText, false);
    return binding;
  }

  @field('black')
  accessor color = 'black';

  get text(): BoundPlainText {
    return this._getTextBinding('text');
  }

  set text(value: PlainTextLike | string) {
    const next = toPlainText(value);
    this._writeField('text', next);
    this._getTextBinding('text').sync(next.toString());
  }

  @field('[0,0,100,100]' as SerializedXYWH)
  accessor xywh: SerializedXYWH = '[0,0,100,100]';
}

export class OfflineConnectorElementModel extends LocalStatefulElementModel<ConnectorElementState> {
  private _getTextBinding(key: string) {
    const cacheKey = `${key}:binding`;
    const current = this._readField<PlainText | undefined>(key);
    const nextText = current?.toString() ?? '';
    let binding = this._local.get(cacheKey) as BoundPlainText | undefined;

    if (!binding) {
      binding = new BoundPlainText(nextText, value => {
        this._writeField(key, new PlainText(value));
      });
      this._local.set(cacheKey, binding);
      return binding;
    }

    binding.sync(nextText, false);
    return binding;
  }

  @field()
  accessor source: ConnectorElementEndpoint | undefined = undefined;

  @field()
  accessor target: ConnectorElementEndpoint | undefined = undefined;

  get text(): BoundPlainText {
    return this._getTextBinding('text');
  }

  set text(value: PlainTextLike | string | undefined) {
    const next = toPlainText(value);
    this._writeField('text', next);
    this._getTextBinding('text').sync(next.toString());
  }
}

export class OfflineGroupElementModel extends LocalStatefulElementModel<GroupElementState> {
  private _getChildrenBinding() {
    const cacheKey = 'children:binding';
    const current = this._readField<Record<string, boolean>>('children', {}) ?? {};
    let binding = this._local.get(cacheKey) as
      | ObservableRecordMap<boolean>
      | undefined;

    if (!binding) {
      binding = new ObservableRecordMap(current, value => {
        this._writeField('children', value);
        this.setChildIds(Object.keys(value));
      });
      this._local.set(cacheKey, binding);
    } else {
      binding.sync(current, false);
    }

    this.setChildIds(Object.keys(current));
    return binding;
  }

  @local()
  accessor childIds: string[] = [];

  get children(): ObservableRecordMap<boolean> {
    return this._getChildrenBinding();
  }

  set children(value: ObservableRecordMap<boolean> | Record<string, boolean>) {
    const next = toRecordValue(value);
    this._writeField('children', next);
    this._getChildrenBinding().sync(next);
  }

  get title(): BoundPlainText {
    const cacheKey = 'title:binding';
    const current = this._readField<PlainText>('title', new PlainText());
    let binding = this._local.get(cacheKey) as BoundPlainText | undefined;

    if (!binding) {
      binding = new BoundPlainText(current?.toString() ?? '', value => {
        this._writeField('title', new PlainText(value));
      });
      this._local.set(cacheKey, binding);
      return binding;
    }

    binding.sync(current?.toString() ?? '', false);
    return binding;
  }

  set title(value: PlainTextLike | string) {
    const next = toPlainText(value);
    this._writeField('title', next);
    this.title.sync(next.toString());
  }

  @field('[0,0,100,100]' as SerializedXYWH)
  accessor xywh: SerializedXYWH = '[0,0,100,100]';

  addChild(id: string) {
    this.children.set(id, true);
  }

  hasChild(id: string) {
    return this.children.has(id);
  }

  removeChild(id: string) {
    this.children.delete(id);
  }

  setChildIds(ids: string[]) {
    this.childIds = ids;
  }
}

export type MindmapTreeNode = {
  children: MindmapTreeNode[];
  detail: MindmapNodeDetail;
  id: string;
};

export class OfflineMindmapElementModel extends LocalStatefulElementModel<MindmapElementState> {
  private _getChildrenBinding() {
    const cacheKey = 'children:binding';
    const current =
      this._readField<Record<string, MindmapNodeDetail>>('children', {}) ?? {};
    let binding = this._local.get(cacheKey) as
      | ObservableRecordMap<MindmapNodeDetail>
      | undefined;

    if (!binding) {
      binding = new ObservableRecordMap(current, value => {
        this._writeField('children', value);
        this.setChildIds(Object.keys(value));
        this._rebuildTree();
      });
      this._local.set(cacheKey, binding);
    } else {
      binding.sync(current, false);
    }

    this.setChildIds(Object.keys(current));
    return binding;
  }

  @local()
  accessor childIds: string[] = [];

  get children(): ObservableRecordMap<MindmapNodeDetail> {
    return this._getChildrenBinding();
  }

  set children(
    value:
      | ObservableRecordMap<MindmapNodeDetail>
      | Record<string, MindmapNodeDetail>
  ) {
    const next = toRecordValue(value);
    this._writeField('children', next);
    this._getChildrenBinding().sync(next);
  }

  @watch((_, instance) => {
    instance._rebuildTree();
  })
  @field('mindmap')
  accessor style = 'mindmap';

  @watch((_, instance) => {
    instance._rebuildTree();
  })
  @field('balance')
  accessor layoutType = 'balance';

  @local()
  accessor tree: MindmapTreeNode[] = [];

  @field('[0,0,100,100]' as SerializedXYWH)
  accessor xywh: SerializedXYWH = '[0,0,100,100]';

  addNode(id: string, detail: MindmapNodeDetail) {
    this.children.set(id, detail);
  }

  removeNode(id: string) {
    const next = this.children.toJSON();
    delete next[id];

    Object.keys(next).forEach(key => {
      if (next[key]?.parent === id) {
        next[key] = {
          ...next[key],
          parent: undefined,
        };
      }
    });

    this.children = next;
  }

  setChildIds(ids: string[]) {
    this.childIds = ids;
    this._rebuildTree();
  }

  private _rebuildTree() {
    const nodeMap = new Map<string, MindmapTreeNode>();
    Object.entries(this.children.toJSON()).forEach(([id, detail]) => {
      nodeMap.set(id, {
        children: [],
        detail,
        id,
      });
    });

    const roots: MindmapTreeNode[] = [];
    nodeMap.forEach(node => {
      if (node.detail.parent && nodeMap.has(node.detail.parent)) {
        nodeMap.get(node.detail.parent)!.children.push(node);
        return;
      }

      roots.push(node);
    });

    this.tree = roots;
  }
}

export class OfflineFrameElementModel extends LocalStatefulElementModel<FrameElementState> {
  @field('transparent')
  accessor background = 'transparent';

  private _getChildrenBinding() {
    const cacheKey = 'childElementIds:binding';
    const current =
      this._readField<Record<string, boolean>>('childElementIds', {}) ?? {};
    let binding = this._local.get(cacheKey) as
      | ObservableRecordMap<boolean>
      | undefined;

    if (!binding) {
      binding = new ObservableRecordMap(current, value => {
        this._writeField('childElementIds', value);
        this.setChildIds(Object.keys(value));
      });
      this._local.set(cacheKey, binding);
    } else {
      binding.sync(current, false);
    }

    this.setChildIds(Object.keys(current));
    return binding;
  }

  @local()
  accessor childIds: string[] = [];

  get childElementIds(): ObservableRecordMap<boolean> {
    return this._getChildrenBinding();
  }

  set childElementIds(
    value: ObservableRecordMap<boolean> | Record<string, boolean>
  ) {
    const next = toRecordValue(value);
    this._writeField('childElementIds', next);
    this._getChildrenBinding().sync(next);
  }

  get title(): BoundPlainText {
    const cacheKey = 'title:binding';
    const current = this._readField<PlainText>('title', new PlainText());
    let binding = this._local.get(cacheKey) as BoundPlainText | undefined;

    if (!binding) {
      binding = new BoundPlainText(current?.toString() ?? '', value => {
        this._writeField('title', new PlainText(value));
      });
      this._local.set(cacheKey, binding);
      return binding;
    }

    binding.sync(current?.toString() ?? '', false);
    return binding;
  }

  set title(value: PlainTextLike | string) {
    const next = toPlainText(value);
    this._writeField('title', next);
    this.title.sync(next.toString());
  }

  @field('[0,0,100,100]' as SerializedXYWH)
  accessor xywh: SerializedXYWH = '[0,0,100,100]';

  addChild(id: string) {
    this.childElementIds.set(id, true);
  }

  removeChild(id: string) {
    this.childElementIds.delete(id);
  }

  setChildIds(ids: string[]) {
    this.childIds = ids;
  }
}

export function registerDefaultElementModels(surface: LocalSurfaceModel) {
  surface.registerElementModel('connector', (nextSurface, state) => {
    return new OfflineConnectorElementModel(
      nextSurface,
      state as ConnectorElementState
    );
  });
  surface.registerElementModel('frame', (nextSurface, state) => {
    return new OfflineFrameElementModel(nextSurface, state as FrameElementState);
  });
  surface.registerElementModel('group', (nextSurface, state) => {
    return new OfflineGroupElementModel(nextSurface, state as GroupElementState);
  });
  surface.registerElementModel('mindmap', (nextSurface, state) => {
    return new OfflineMindmapElementModel(
      nextSurface,
      state as MindmapElementState
    );
  });
  surface.registerElementModel('shape', (nextSurface, state) => {
    return new OfflineShapeElementModel(nextSurface, state as ShapeElementState);
  });
  surface.registerElementModel('text', (nextSurface, state) => {
    return new OfflineTextElementModel(nextSurface, state as TextElementState);
  });
}
