import { DisposableGroup } from '@linvo-core/global/disposable';

import { onSurfaceAdded } from '../../utils/gfx';
import {
  type GfxBlockComponent,
  isGfxBlockComponent,
} from '../../dom';
import type { GfxController } from '../controller';
import { GfxExtension, GfxExtensionIdentifier } from '../extension';
import type { GfxModel } from '../scene/model';
import type { GfxPrimitiveElementModel } from '../scene/surface/element-model';
import type { GfxLocalElementModel } from '../scene/surface/local-element-model';
import type { SurfaceBlockModel } from '../scene/surface/surface-model';
import {
  GfxElementModelView,
  GfxElementModelViewExtIdentifier,
} from './view';

export class ViewManager extends GfxExtension {
  static override key = 'viewManager';

  private readonly _disposable = new DisposableGroup();

  private readonly _viewCtorMap = new Map<string, typeof GfxElementModelView>();

  private readonly _viewMap = new Map<string, GfxElementModelView>();

  constructor(gfx: GfxController) {
    super(gfx);
  }

  static override extendGfx(gfx: GfxController): void {
    Object.defineProperty(gfx, 'view', {
      get() {
        return this.std.get(GfxExtensionIdentifier('viewManager'));
      },
    });
  }

  get(
    model: GfxModel | GfxLocalElementModel | string
  ): GfxElementModelView | GfxBlockComponent | null {
    model = typeof model === 'string' ? model : model.id;

    if (this._viewMap.has(model)) {
      return this._viewMap.get(model)!;
    }

    const blockView = this.std.view.getBlock(model);

    if (blockView && isGfxBlockComponent(blockView)) {
      return blockView;
    }

    return null;
  }

  override mounted(): void {
    this.std.provider
      .getAll(GfxElementModelViewExtIdentifier)
      .forEach(viewCtor => {
        this._viewCtorMap.set(viewCtor.type, viewCtor);
      });

    const updateViewOnElementChange = (surface: SurfaceBlockModel) => {
      const createView = (
        model: GfxPrimitiveElementModel | GfxLocalElementModel
      ) => {
        const ViewCtor =
          this._viewCtorMap.get(model.type) ?? GfxElementModelView;
        const view = new ViewCtor(model, this.gfx);

        this._viewMap.set(model.id, view);
        view.onCreated();
      };

      this._disposable.add(
        surface.elementAdded.subscribe(payload => {
          const model = surface.getElementById(payload.id);
          if (!model) return;
          createView(model);
        })
      );

      this._disposable.add(
        surface.elementRemoved.subscribe(elem => {
          const view = this._viewMap.get(elem.id);
          this._viewMap.delete(elem.id);
          view?.onDestroyed();
        })
      );

      this._disposable.add(
        surface.localElementAdded.subscribe(model => {
          createView(model);
        })
      );

      this._disposable.add(
        surface.localElementDeleted.subscribe(model => {
          const view = this._viewMap.get(model.id);
          this._viewMap.delete(model.id);
          view?.onDestroyed();
        })
      );

      surface.localElementModels.forEach(model => {
        createView(model);
      });

      surface.elementModels.forEach(model => {
        createView(model);
      });
    };

    if (this.gfx.surface) {
      updateViewOnElementChange(this.gfx.surface);
    } else {
      this._disposable.add(
        onSurfaceAdded(this.std.store, surface => {
          if (surface) {
            updateViewOnElementChange(surface);
          }
        })
      );
    }
  }

  override unmounted(): void {
    this._disposable.dispose();
    this._viewMap.forEach(view => view.onDestroyed());
    this._viewMap.clear();
  }
}

declare module '../controller.js' {
  interface GfxController {
    readonly view: ViewManager;
  }
}
