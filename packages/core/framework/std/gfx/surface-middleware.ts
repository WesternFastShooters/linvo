import { type Container, createIdentifier } from '@linvo-core/composition/di';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Extension } from '@linvo-core/store';

import { LifeCycleWatcher } from '../extension/lifecycle-watcher';
import { StdIdentifier } from '../identifier';
import type { BlockStdScope } from '../scope/std-scope';
import { onSurfaceAdded } from '../utils/gfx';
import { GfxControllerIdentifier } from './identifiers';
import type { SurfaceMiddleware } from './scene/surface/surface-model';

export abstract class SurfaceMiddlewareBuilder extends Extension {
  static key: string = '';

  abstract middleware: SurfaceMiddleware;

  get gfx() {
    return this.std.provider.get(GfxControllerIdentifier);
  }

  constructor(protected std: BlockStdScope) {
    super();
  }

  static override setup(di: Container) {
    if (!this.key) {
      throw new LinvoError(
        ErrorCode.ValueNotExists,
        'The surface middleware builder should have a static key property.'
      );
    }

    di.addImpl(SurfaceMiddlewareBuilderIdentifier(this.key), this, [
      StdIdentifier,
    ]);
  }

  mounted(): void {}

  unmounted(): void {}
}

export const SurfaceMiddlewareBuilderIdentifier =
  createIdentifier<SurfaceMiddlewareBuilder>('SurfaceMiddlewareBuilder');

export class SurfaceMiddlewareExtension extends LifeCycleWatcher {
  static override key: string = 'surfaceMiddleware';

  override mounted(): void {
    const builders = Array.from(
      this.std.provider.getAll(SurfaceMiddlewareBuilderIdentifier).values()
    );

    const dispose = onSurfaceAdded(this.std.store, surface => {
      if (surface) {
        surface.applyMiddlewares(builders.map(builder => builder.middleware));
        queueMicrotask(() => dispose());
      }
    });
  }
}
