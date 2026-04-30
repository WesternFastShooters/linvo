import { DefaultTool } from '@linvo/linvo-block-surface';
import type { GroupElementModel } from '@linvo/linvo-model';
import { LinvoError, ErrorCode } from '@linvo/global/exceptions';
import type { BlockComponent } from '@linvo/std';
import { GfxControllerIdentifier } from '@linvo/std/gfx';

import { EdgelessGroupTitleEditor } from './edgeless-group-title-editor';

export function mountGroupTitleEditor(
  group: GroupElementModel,
  edgeless: BlockComponent
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
    elements: [group.id],
    editing: true,
  });

  const groupEditor = new EdgelessGroupTitleEditor();
  groupEditor.group = group;

  mountElm.append(groupEditor);
}
