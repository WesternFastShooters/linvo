import { signal } from '@preact/signals-core';
import { Subject } from 'rxjs';

import type { Store } from '../../document';
import type { DocSnapshot } from '../../transformer';
import { StoreExtension } from '../store-extension';

type HistoryEventName =
  | 'stack-cleared'
  | 'stack-item-added'
  | 'stack-item-popped'
  | 'stack-item-updated';

export interface HistoryStackItem {
  after: DocSnapshot | null;
  before: DocSnapshot | null;
  meta: Map<string, unknown>;
}

type HistoryEventMap = {
  'stack-cleared': Record<string, never>;
  'stack-item-added': { stackItem: HistoryStackItem };
  'stack-item-popped': { stackItem: HistoryStackItem };
  'stack-item-updated': { stackItem: HistoryStackItem };
};

export interface UndoController {
  canRedo(): boolean;
  canUndo(): boolean;
  clear(): void;
  off<T extends HistoryEventName>(
    eventName: T,
    listener: (event: HistoryEventMap[T]) => void
  ): void;
  on<T extends HistoryEventName>(
    eventName: T,
    listener: (event: HistoryEventMap[T]) => void
  ): typeof listener;
  redo(): Promise<void>;
  stopCapturing(): void;
  undo(): Promise<void>;
}

export class HistoryExtension extends StoreExtension implements UndoController {
  static override readonly key = 'history';

  private readonly _canRedo = signal(false);

  private readonly _canUndo = signal(false);

  private readonly _listeners = new Map<
    HistoryEventName,
    Set<(event: unknown) => void>
  >();

  private readonly _redoStack: HistoryStackItem[] = [];

  private readonly _undoStack: HistoryStackItem[] = [];

  private _applyingHistory = false;

  private _isCapturing = false;

  private _pendingBefore: DocSnapshot | null | undefined;

  private _splitNextEntry = true;

  readonly onUpdated = new Subject<void>();

  private readonly _updateCanUndoRedoSignals = () => {
    const canRedo = this.canRedo();
    const canUndo = this.canUndo();
    if (this._canRedo.peek() !== canRedo) {
      this._canRedo.value = canRedo;
    }
    if (this._canUndo.peek() !== canUndo) {
      this._canUndo.value = canUndo;
    }
  };

  get canRedo$() {
    return this._canRedo;
  }

  get canUndo$() {
    return this._canUndo;
  }

  get undoManager() {
    return this as UndoController;
  }

  canRedo() {
    return this._redoStack.length > 0;
  }

  canUndo() {
    return this._undoStack.length > 0;
  }

  clear() {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._updateCanUndoRedoSignals();
    this._emit('stack-cleared', {});
  }

  beginTransaction(captureHistory: boolean) {
    if (!captureHistory || this._applyingHistory || this._isCapturing) {
      return;
    }

    this._pendingBefore = this._takeSnapshot();
    this._isCapturing = true;
  }

  endTransaction(captureHistory: boolean) {
    if (!captureHistory || this._applyingHistory || !this._isCapturing) {
      return;
    }

    const before = this._pendingBefore ?? null;
    const after = this._takeSnapshot();

    this._isCapturing = false;
    this._pendingBefore = undefined;

    if (this._snapshotKey(before) === this._snapshotKey(after)) {
      return;
    }

    const stackItem: HistoryStackItem = {
      before,
      after,
      meta: new Map(),
    };

    if (this._splitNextEntry || this._undoStack.length === 0) {
      this._undoStack.push(stackItem);
      this._redoStack.length = 0;
      this._emit('stack-item-added', { stackItem });
    } else {
      const current = this._undoStack[this._undoStack.length - 1];
      current.after = after;
      this._redoStack.length = 0;
      this._emit('stack-item-updated', { stackItem: current });
    }

    this._splitNextEntry = true;
    this._updateCanUndoRedoSignals();
  }

  override loaded() {
    this._updateCanUndoRedoSignals();
  }

  on<T extends HistoryEventName>(
    eventName: T,
    listener: (event: HistoryEventMap[T]) => void
  ) {
    const listeners = this._listeners.get(eventName) ?? new Set();
    listeners.add(listener as (event: unknown) => void);
    this._listeners.set(eventName, listeners);
    return listener;
  }

  off<T extends HistoryEventName>(
    eventName: T,
    listener: (event: HistoryEventMap[T]) => void
  ) {
    this._listeners.get(eventName)?.delete(listener as (event: unknown) => void);
  }

  async redo() {
    const stackItem = this._redoStack.pop();
    if (!stackItem) {
      return;
    }

    this._applyingHistory = true;
    try {
      await this._restoreSnapshot(stackItem.after);
    } finally {
      this._applyingHistory = false;
    }

    this._undoStack.push(stackItem);
    this._updateCanUndoRedoSignals();
    this._emit('stack-item-popped', { stackItem });
  }

  stopCapturing() {
    this._splitNextEntry = true;
  }

  async undo() {
    const stackItem = this._undoStack.pop();
    if (!stackItem) {
      return;
    }

    this._applyingHistory = true;
    try {
      await this._restoreSnapshot(stackItem.before);
    } finally {
      this._applyingHistory = false;
    }

    this._redoStack.push(stackItem);
    this._updateCanUndoRedoSignals();
    this._emit('stack-item-popped', { stackItem });
  }

  override disposed() {
    super.disposed();
    this._listeners.clear();
    this.onUpdated.complete();
  }

  private _cloneSnapshot(snapshot: DocSnapshot | null) {
    if (!snapshot) {
      return null;
    }

    return JSON.parse(JSON.stringify(snapshot)) as DocSnapshot;
  }

  private _takeSnapshot() {
    if (!this.store.root) {
      return null;
    }

    return this._cloneSnapshot(
      this.store.getTransformer().docToSnapshot(this.store) ?? null
    );
  }

  private _emit<T extends HistoryEventName>(
    eventName: T,
    event: HistoryEventMap[T]
  ) {
    this._listeners.get(eventName)?.forEach(listener => {
      listener(event);
    });
    this.onUpdated.next();
  }

  private async _restoreSnapshot(snapshot: DocSnapshot | null) {
    await this.store.withoutTransact(async () => {
      this.store.doc.clear();

      if (!snapshot) {
        return;
      }

      await this.store
        .getTransformer()
        .snapshotToBlock(this._cloneSnapshot(snapshot)!.blocks, this.store);
    });
  }

  private _snapshotKey(snapshot: DocSnapshot | null) {
    return JSON.stringify(snapshot);
  }
}
