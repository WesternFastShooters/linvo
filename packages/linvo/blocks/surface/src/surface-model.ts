import type {
  ConnectorElementModel,
  SurfaceElementModelMap,
} from '@linvo/linvo-model';
import { DisposableGroup } from '@linvo/global/disposable';
import type { SurfaceBlockProps } from '@linvo/std/gfx';
import { SurfaceBlockModel as BaseSurfaceModel } from '@linvo/std/gfx';
import { BlockSchemaExtension, defineBlockSchema } from '@linvo/store';
import * as Y from 'yjs';

import { elementsCtorMap } from './element-model/index.js';
import { surfaceMiddlewareIdentifier } from './extensions/surface-middleware.js';
import { SurfaceBlockTransformer } from './surface-transformer.js';

export const SurfaceBlockSchema = defineBlockSchema({
  flavour: 'linvo:surface',
  props: (internalPrimitives): SurfaceBlockProps => ({
    elements: internalPrimitives.Boxed(new Y.Map()),
  }),
  metadata: {
    version: 5,
    role: 'hub',
    parent: ['@root'],
    children: [
      'linvo:frame',
      'linvo:image',
      'linvo:bookmark',
      'linvo:attachment',
      'linvo:embed-*',
      'linvo:edgeless-text',
    ],
  },
  transformer: transformerConfigs =>
    new SurfaceBlockTransformer(transformerConfigs),
  toModel: () => new SurfaceBlockModel(),
});

export const SurfaceBlockSchemaExtension =
  BlockSchemaExtension(SurfaceBlockSchema);

export class SurfaceBlockModel extends BaseSurfaceModel {
  private readonly _disposables: DisposableGroup = new DisposableGroup();

  override _init() {
    this._extendElement(elementsCtorMap);
    super._init();
    this.store.provider
      .getAll(surfaceMiddlewareIdentifier)
      .forEach(({ middleware }) => {
        this._disposables.add(middleware(this));
      });
  }

  getConnectors(id: string) {
    const connectors = this.getElementsByType(
      'connector'
    ) as unknown[] as ConnectorElementModel[];

    return connectors.filter(
      connector => connector.source?.id === id || connector.target?.id === id
    );
  }

  override getElementsByType<K extends keyof SurfaceElementModelMap>(
    type: K
  ): SurfaceElementModelMap[K][] {
    return super.getElementsByType(type) as SurfaceElementModelMap[K][];
  }
}
