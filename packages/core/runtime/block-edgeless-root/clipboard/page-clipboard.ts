import {
  pasteMiddleware,
  replaceIdMiddleware,
  surfaceRefToEmbed,
  uploadMiddleware,
} from '@linvo-core/shared/adapters';
import {
  clearAndSelectFirstModelCommand,
  deleteSelectedModelsCommand,
  getBlockIndexCommand,
  getBlockSelectionsCommand,
  getImageSelectionsCommand,
  getSelectedModelsCommand,
  retainFirstModelCommand,
} from '@linvo-core/shared/commands';
import { DisposableGroup } from '@linvo-core/global/disposable';
import type { UIEventHandler } from '@linvo-core/std';
import type { BlockSnapshot, Store } from '@linvo-core/store';

import { ReadOnlyClipboard } from './readonly-clipboard';

/**
 * PageClipboard is a class that provides a clipboard for the page root block.
 * It is supported to copy and paste models in the page root block.
 */
export class PageClipboard extends ReadOnlyClipboard {
  static override key = 'linvo-page-clipboard';

  protected _init = () => {
    this._initAdapters();
    const paste = pasteMiddleware(this.std);
    // Keep surface-ref import stable for clipboard round-trips.
    const surfaceRefToEmbedMiddleware = surfaceRefToEmbed(this.std);
    const replaceId = replaceIdMiddleware(this.std.store.docSource.idGenerator);
    const upload = uploadMiddleware(this.std);
    this.std.clipboard.use(paste);
    this.std.clipboard.use(surfaceRefToEmbedMiddleware);
    this.std.clipboard.use(replaceId);
    this.std.clipboard.use(upload);
    this._disposables.add({
      dispose: () => {
        this.std.clipboard.unuse(paste);
        this.std.clipboard.unuse(surfaceRefToEmbedMiddleware);
        this.std.clipboard.unuse(replaceId);
        this.std.clipboard.unuse(upload);
      },
    });
  };

  onBlockSnapshotPaste = async (
    snapshot: BlockSnapshot,
    doc: Store,
    parent?: string,
    index?: number
  ) => {
    const block = await this.std.clipboard.pasteBlockSnapshot(
      snapshot,
      doc,
      parent,
      index
    );
    return block?.id ?? null;
  };

  onPageCut: UIEventHandler = ctx => {
    const e = ctx.get('clipboardState').raw;
    e.preventDefault();

    this._copySelectedInPage(() => {
      this.std.command
        .chain()
        .pipe(getSelectedModelsCommand)
        .pipe(deleteSelectedModelsCommand)
        .run();
    }).run();
  };

  onPagePaste: UIEventHandler = ctx => {
    const e = ctx.get('clipboardState').raw;
    e.preventDefault();

    if (this.std.store.readonly) return;
    this.std.store.captureSync();
    this.std.command
      .chain()
      .try<{ currentSelectionPath: string }>(cmd => [
        cmd.pipe(getBlockSelectionsCommand).pipe((ctx, next) => {
          const currentBlockSelections = ctx.currentBlockSelections;
          if (!currentBlockSelections) {
            return;
          }
          const blockSelection = currentBlockSelections.at(-1);
          if (!blockSelection) {
            return;
          }
          next({ currentSelectionPath: blockSelection.blockId });
        }),
        cmd.pipe(getImageSelectionsCommand).pipe((ctx, next) => {
          const currentImageSelections = ctx.currentImageSelections;
          if (!currentImageSelections) {
            return;
          }
          const imageSelection = currentImageSelections.at(-1);
          if (!imageSelection) {
            return;
          }
          next({ currentSelectionPath: imageSelection.blockId });
        }),
      ])
      .pipe(getSelectedModelsCommand)
      .pipe(clearAndSelectFirstModelCommand)
      .pipe(retainFirstModelCommand)
      .pipe(deleteSelectedModelsCommand)
      .pipe(getBlockIndexCommand)
      .pipe((ctx, next) => {
        if (!ctx.parentBlock) {
          return;
        }
        this.std.clipboard
          .paste(
            e,
            this.std.store,
            ctx.parentBlock.model.id,
            ctx.blockIndex ? ctx.blockIndex + 1 : 1
          )
          .catch(console.error);

        return next();
      })
      .run();
  };

  override mounted() {
    if (!navigator.clipboard) {
      console.error(
        'navigator.clipboard is not supported in current environment.'
      );
      return;
    }
    if (this._disposables.disposed) {
      this._disposables = new DisposableGroup();
    }
    this.std.event.add('copy', this.onPageCopy);
    this.std.event.add('paste', this.onPagePaste);
    this.std.event.add('cut', this.onPageCut);
    this._init();
  }
}
