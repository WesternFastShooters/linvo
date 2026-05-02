import { IS_MAC, IS_WINDOWS } from '@linvo-core/global/env';
import type { BlockComponent, UIEventHandler } from '@linvo-core/std';

export class CommonKeyboardManager {
  protected get _doc() {
    return this.rootComponent.store;
  }

  constructor(public rootComponent: BlockComponent) {
    this.rootComponent.bindHotKey(
      {
        'Mod-z': ctx => {
          ctx.get('defaultState').event.preventDefault();

          if (this._doc.canUndo) {
            this._doc.undo();
          }
        },
        'Shift-Mod-z': ctx => {
          ctx.get('defaultState').event.preventDefault();
          if (this._doc.canRedo) {
            this._doc.redo();
          }
        },
        'Control-y': ctx => {
          if (!IS_WINDOWS) return;

          ctx.get('defaultState').event.preventDefault();
          if (this._doc.canRedo) {
            this._doc.redo();
          }
        },
        'Control-d': ctx => {
          if (!IS_MAC) return;
          this.handleMacDelete(ctx);
        },
      },
      {
        global: true,
      }
    );
  }

  protected handleMacDelete(_ctx: Parameters<UIEventHandler>[0]) {}
}
