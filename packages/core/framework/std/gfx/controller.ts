import { DisposableGroup } from '@linvo-core/global/disposable';
import {
  Bound,
  getCommonBound,
  getCommonBoundWithRotation,
  type IBound,
} from '@linvo-core/global/gfx';
import { assertType } from '@linvo-core/global/utils';
import type { BlockModel } from '@linvo-core/store';
import { Signal } from '@preact/signals-core';
import last from 'lodash-es/last';

import { LifeCycleWatcher } from '../extension/lifecycle-watcher';
import type { BlockStdScope } from '../scope/std-scope';
import { onSurfaceAdded } from '../utils/gfx';
import type { BlockComponent } from '../dom';
import type { CursorType } from './cursor';
import {
  GfxClassExtenderIdentifier,
  GfxExtensionIdentifier,
} from './extension';
import { GridManager } from './grid';
import { gfxControllerKey } from './identifiers';
import { KeyboardController } from './keyboard';
import { LayerManager } from './layer';
import type { PointTestOptions } from './scene/base';
import { GfxBlockElementModel } from './scene/gfx-block-model';
import type { GfxModel } from './scene/model';
import { GfxPrimitiveElementModel } from './scene/surface/element-model';
import type { SurfaceBlockModel } from './scene/surface/surface-model';
import { FIT_TO_SCREEN_PADDING, Viewport, ZOOM_INITIAL } from './viewport';

export class GfxController extends LifeCycleWatcher {
  static override key = gfxControllerKey;

  private readonly _disposables: DisposableGroup = new DisposableGroup();

  private readonly _surface$ = new Signal<SurfaceBlockModel | null>(null);

  readonly cursor$ = new Signal<CursorType>();

  readonly keyboard: KeyboardController;

  readonly viewport: Viewport = new Viewport();

  get grid() {
    return this.std.get(GridManager);
  }

  get layer() {
    return this.std.get(LayerManager);
  }

  get doc() {
    return this.std.store;
  }

  get elementsBound() {
    return getCommonBoundWithRotation(this.gfxElements);
  }

  get gfxElements(): GfxModel[] {
    return [...this.layer.blocks, ...this.layer.canvasElements];
  }

  get surface$() {
    return this._surface$;
  }

  get surface() {
    return this._surface$.peek();
  }

  get surfaceComponent(): BlockComponent | null {
    return this.surface
      ? (this.std.view.getBlock(this.surface.id) ?? null)
      : null;
  }

  constructor(std: BlockStdScope) {
    super(std);

    this.keyboard = new KeyboardController(std);

    this._disposables.add(
      onSurfaceAdded(this.doc, surface => {
        this._surface$.value = surface;
      })
    );
    this._disposables.add(this.viewport);
    this._disposables.add(this.keyboard);

    this.std.provider.getAll(GfxClassExtenderIdentifier).forEach(ext => {
      ext.extendFn(this);
    });
  }

  deleteElement(element: GfxModel | BlockModel<object> | string): void {
    element = typeof element === 'string' ? element : element.id;

    assertType<string>(element);

    if (this.surface?.hasElementById(element)) {
      this.surface.deleteElement(element);
    } else {
      const block = this.doc.getBlock(element)?.model;
      block && this.doc.deleteBlock(block);
    }
  }

  /**
   * Get a block or element by its id.
   * Note that non-gfx block can also be queried in this method.
   * @param id
   * @returns
   */
  getElementById<
    T extends GfxModel | BlockModel<object> = GfxModel | BlockModel<object>,
  >(id: string): T | null {
    // @ts-expect-error FIXME: ts error
    return (
      this.surface?.getElementById(id) ?? this.doc.getBlock(id)?.model ?? null
    );
  }

  /**
   * Get elements on a specific point.
   * @param x
   * @param y
   * @param options
   */
  getElementByPoint(
    x: number,
    y: number,
    options: { all: true } & PointTestOptions
  ): GfxModel[];
  getElementByPoint(
    x: number,
    y: number,
    options?: { all?: false } & PointTestOptions
  ): GfxModel | null;
  getElementByPoint(
    x: number,
    y: number,
    options: PointTestOptions & {
      all?: boolean;
    } = { all: false, hitThreshold: 10 }
  ): GfxModel | GfxModel[] | null {
    options.zoom = this.viewport.zoom;
    options.hitThreshold ??= 10;

    const hitThreshold = options.hitThreshold;
    const responsePadding = options.responsePadding ?? [
      hitThreshold / 2,
      hitThreshold / 2,
    ];
    const all = options.all ?? false;
    const hitTestBound = {
      x: x - responsePadding[0],
      y: y - responsePadding[1],
      w: responsePadding[0] * 2,
      h: responsePadding[1] * 2,
    };

    const candidates = this.grid.search(hitTestBound);
    const picked = candidates.filter(
      elm =>
        elm.includesPoint(x, y, options as PointTestOptions, this.std.host) ||
        elm.externalBound?.isPointInBound([x, y])
    );

    picked.sort(this.layer.compare);

    if (all) {
      return picked;
    }

    return last(picked) ?? null;
  }

  /**
   * Query all elements in an area.
   * @param bound
   * @param options
   */
  getElementsByBound(
    bound: IBound | Bound,
    options?: { type: 'all' }
  ): GfxModel[];

  getElementsByBound(
    bound: IBound | Bound,
    options: { type: 'canvas' }
  ): GfxPrimitiveElementModel[];

  getElementsByBound(
    bound: IBound | Bound,
    options: { type: 'block' }
  ): GfxBlockElementModel[];

  getElementsByBound(
    bound: IBound | Bound,
    options: { type: 'block' | 'canvas' | 'all' } = {
      type: 'all',
    }
  ): GfxModel[] {
    bound = bound instanceof Bound ? bound : Bound.from(bound);

    let candidates = this.grid.search(bound);

    if (options.type !== 'all') {
      const filter =
        options.type === 'block'
          ? (elm: GfxModel) => elm instanceof GfxBlockElementModel
          : (elm: GfxModel) => elm instanceof GfxPrimitiveElementModel;

      candidates = candidates.filter(filter);
    }

    candidates.sort(this.layer.compare);

    return candidates;
  }

  getElementsByType(type: string): (GfxModel | BlockModel<object>)[] {
    return (
      this.surface?.getElementsByType(type) ??
      this.doc.getBlocksByFlavour(type).map(b => b.model)
    );
  }

  override mounted() {
    this.viewport.setShellElement(this.std.host);
    this.std.provider.getAll(GfxExtensionIdentifier).forEach(ext => {
      ext.mounted();
    });
  }

  override unmounted() {
    this.std.provider.getAll(GfxExtensionIdentifier).forEach(ext => {
      ext.unmounted();
    });
    this.viewport.clearViewportElement();
    this._disposables.dispose();
  }

  updateElement(
    element: GfxModel | string,
    props: Record<string, unknown>
  ): void {
    const elemId = typeof element === 'string' ? element : element.id;

    if (this.surface?.hasElementById(elemId)) {
      this.surface.updateElement(elemId, props);
    } else {
      const block = this.doc.getBlock(elemId);
      block && this.doc.updateBlock(block.model, props);
    }
  }

  fitToScreen(
    options: {
      bounds?: Bound[];
      smooth?: boolean;
      padding?: [number, number, number, number];
    } = {
      smooth: false,
      padding: [0, 0, 0, 0],
    }
  ) {
    const elemBounds =
      options.bounds ??
      this.gfxElements.map(element => Bound.deserialize(element.xywh));
    const commonBound = getCommonBound(elemBounds);
    const { zoom, centerX, centerY } = this.viewport.getFitToScreenData(
      commonBound,
      options.padding,
      ZOOM_INITIAL,
      FIT_TO_SCREEN_PADDING
    );

    this.viewport.setViewport(zoom, [centerX, centerY], options.smooth);
  }
}
