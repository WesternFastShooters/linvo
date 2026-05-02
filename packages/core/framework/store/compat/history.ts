import { Subject } from 'rxjs';

export type HistoryMutation = {
  redo: () => void;
  undo: () => void;
};

export type HistoryEntry = {
  label?: string;
  mutations: HistoryMutation[];
};

export type LocalHistoryStats = {
  canRedo: boolean;
  canUndo: boolean;
  redoDepth: number;
  undoDepth: number;
};

export class LocalHistoryManager {
  readonly updated = new Subject<LocalHistoryStats>();

  private readonly _redoStack: HistoryEntry[] = [];

  private readonly _undoStack: HistoryEntry[] = [];

  get canRedo() {
    return this._redoStack.length > 0;
  }

  get canUndo() {
    return this._undoStack.length > 0;
  }

  get stats(): LocalHistoryStats {
    return {
      canRedo: this.canRedo,
      canUndo: this.canUndo,
      redoDepth: this._redoStack.length,
      undoDepth: this._undoStack.length,
    };
  }

  clear() {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this.updated.next(this.stats);
  }

  popRedo() {
    const entry = this._redoStack.pop();
    this.updated.next(this.stats);
    return entry;
  }

  popUndo() {
    const entry = this._undoStack.pop();
    this.updated.next(this.stats);
    return entry;
  }

  pushRedo(entry: HistoryEntry) {
    this._redoStack.push(entry);
    this.updated.next(this.stats);
  }

  pushUndo(entry: HistoryEntry) {
    this._undoStack.push(entry);
    this._redoStack.length = 0;
    this.updated.next(this.stats);
  }
}
