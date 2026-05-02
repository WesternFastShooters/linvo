import type { SurfaceBlockProps } from '@linvo-core/std/gfx';
import type {
  FromSnapshotPayload,
  SnapshotNode,
  ToSnapshotPayload,
} from '@linvo-core/store';
import { BaseBlockTransformer } from '@linvo-core/store';

export class SurfaceBlockTransformer extends BaseBlockTransformer<SurfaceBlockProps> {
  override async fromSnapshot(
    payload: FromSnapshotPayload
  ): Promise<SnapshotNode<SurfaceBlockProps>> {
    const snapshotRet = await super.fromSnapshot(payload);
    const elementsJSON = snapshotRet.props.elements as unknown as
      | Record<string, Record<string, unknown>>
      | undefined;

    snapshotRet.props = {
      elements: this._internal.Boxed(elementsJSON ?? {}),
    };

    return snapshotRet;
  }

  override toSnapshot(payload: ToSnapshotPayload<SurfaceBlockProps>) {
    const snapshot = super.toSnapshot(payload);
    const elementsValue = payload.model.props.elements.getValue() ?? {};
    const selectedElements = this.transformerConfigs.get(
      'selectedElements'
    ) as Set<string> | undefined;

    snapshot.props = {
      elements: Object.fromEntries(
        Object.entries(elementsValue).filter(([id]) =>
          selectedElements ? selectedElements.has(id) : true
        )
      ),
    };

    return snapshot;
  }
}
