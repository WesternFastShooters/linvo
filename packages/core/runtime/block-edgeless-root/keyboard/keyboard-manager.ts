import { IS_MAC } from '@linvo-core/global/env';
import {
  type BlockComponent,
  BlockSelection,
  type UIEventHandler,
} from '@linvo-core/std';

import { CommonKeyboardManager } from './common-keyboard-manager';

export class PageKeyboardManager extends CommonKeyboardManager {
  private readonly _handleDelete: UIEventHandler = ctx => {
    const event = ctx.get('defaultState').event;
    const blockSelections = this._currentSelection.filter(sel =>
      sel.is(BlockSelection)
    );
    if (blockSelections.length === 0) {
      return;
    }

    event.preventDefault();

    const deletedBlocks: string[] = [];
    blockSelections.forEach(sel => {
      const id = sel.blockId;
      const block = this._doc.getBlock(id);
      if (!block) return;
      deletedBlocks.push(id);
    });

    this._doc.transact(() => {
      deletedBlocks.forEach(id => {
        const block = this._doc.getBlock(id);
        if (block) {
          this._doc.deleteBlock(block.model);
        }
      });

      this._selection.clear(['block', 'text']);
    });
  };

  private get _currentSelection() {
    return this._selection.value;
  }

  private get _selection() {
    return this.rootComponent.host.selection;
  }

  constructor(public rootComponent: BlockComponent) {
    super(rootComponent);
    this.rootComponent.bindHotKey(
      {
        'Mod-Backspace': () => true,
        Backspace: this._handleDelete,
        Delete: this._handleDelete,
      },
      {
        global: true,
      }
    );
  }

  protected override handleMacDelete(ctx: Parameters<UIEventHandler>[0]) {
    this._handleDelete(ctx);
  }
}
