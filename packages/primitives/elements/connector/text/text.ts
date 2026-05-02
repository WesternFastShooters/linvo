import {
  DefaultTool,
  EdgelessCRUDIdentifier,
} from '@linvo-core/block-surface';
import { createSurfaceText } from '@linvo-primitives/text';
import type { ConnectorElementModel } from '@linvo-core/content';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import type { IVec } from '@linvo-core/global/gfx';
import { Bound } from '@linvo-core/global/gfx';
import type { BlockComponent } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';

import { EdgelessConnectorLabelEditor } from './edgeless-connector-label-editor';

export function mountConnectorLabelEditor(
  connector: ConnectorElementModel,
  edgeless: BlockComponent,
  point?: IVec
) {
  const mountElm = edgeless.querySelector('.edgeless-mount-point');
  if (!mountElm) {
    throw new LinvoError(
      ErrorCode.ValueNotExists,
      "edgeless block's mount point does not exist"
    );
  }

  const gfx = edgeless.std.get(GfxControllerIdentifier);

  gfx.tool.setTool(DefaultTool);
  gfx.selection.set({
    elements: [connector.id],
    editing: true,
  });

  if (!connector.text) {
    const labelOffset = connector.labelOffset;
    let labelXYWH = connector.labelXYWH ?? [0, 0, 16, 16];

    if (point) {
      const center = connector.getNearestPoint(point);
      const distance = connector.getOffsetDistanceByPoint(center as IVec);
      const bounds = Bound.fromXYWH(labelXYWH);
      bounds.center = center;
      labelOffset.distance = distance;
      labelXYWH = bounds.toXYWH();
    }

    edgeless.std.get(EdgelessCRUDIdentifier).updateElement(connector.id, {
      text: createSurfaceText(),
      labelXYWH,
      labelOffset: { ...labelOffset },
    });
  }

  const editor = new EdgelessConnectorLabelEditor();
  editor.connector = connector;

  mountElm.append(editor);
  editor.updateComplete
    .then(() => {
      editor.inlineEditor?.focusEnd();
    })
    .catch(console.error);
}
