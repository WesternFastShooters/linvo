import { Subject } from 'rxjs';

import {
  LocalHistoryManager,
  type HistoryMutation,
  type LocalHistoryStats,
} from './history';

type TransactionOptions = {
  captureHistory?: boolean;
  label?: string;
};

export type LocalTransactionCommit = {
  captureHistory: boolean;
  id: number;
  label?: string;
  mutationCount: number;
};

type TransactionState = {
  captureStack: boolean[];
  id: number;
  label?: string;
  mutations: HistoryMutation[];
};

export class LocalStore {
  readonly history = new LocalHistoryManager();

  readonly slots = {
    historyUpdated: new Subject<LocalHistoryStats>(),
    transactionCommitted: new Subject<LocalTransactionCommit>(),
  };

  private _applyingHistory = false;

  private _nextTransactionId = 1;

  private _readonly = false;

  private _transaction: TransactionState | null = null;

  constructor() {
    this.history.updated.subscribe(stats => {
      this.slots.historyUpdated.next(stats);
    });
  }

  get canRedo() {
    return !this._readonly && this.history.canRedo;
  }

  get canUndo() {
    return !this._readonly && this.history.canUndo;
  }

  get readonly() {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = value;
  }

  clearHistory() {
    this.history.clear();
  }

  recordMutation(mutation: HistoryMutation) {
    const transaction = this._transaction;
    if (!transaction) {
      throw new Error('recordMutation must be called inside LocalStore.transact()');
    }

    if (this._applyingHistory || !this._shouldCaptureHistory(transaction)) {
      return;
    }

    transaction.mutations.push(mutation);
  }

  redo() {
    if (!this.canRedo) {
      return;
    }

    const entry = this.history.popRedo();
    if (!entry) {
      return;
    }

    this._applyingHistory = true;
    try {
      this.transact(
        () => {
          entry.mutations.forEach(mutation => {
            mutation.redo();
          });
        },
        {
          captureHistory: false,
          label: entry.label ?? 'redo',
        }
      );
    } finally {
      this._applyingHistory = false;
    }

    this.history.pushUndo(entry);
  }

  transact<T>(fn: () => T, options: TransactionOptions = {}): T {
    const transaction = this._transaction;
    const captureHistory = options.captureHistory !== false;

    if (transaction) {
      transaction.captureStack.push(captureHistory);
      try {
        return fn();
      } finally {
        transaction.captureStack.pop();
      }
    }

    const nextTransaction: TransactionState = {
      captureStack: [captureHistory],
      id: this._nextTransactionId++,
      label: options.label,
      mutations: [],
    };

    this._transaction = nextTransaction;

    try {
      return fn();
    } finally {
      this._transaction = null;
      const committed = {
        captureHistory: this._shouldCaptureHistory(nextTransaction),
        id: nextTransaction.id,
        label: nextTransaction.label,
        mutationCount: nextTransaction.mutations.length,
      } satisfies LocalTransactionCommit;

      if (committed.captureHistory && nextTransaction.mutations.length > 0) {
        this.history.pushUndo({
          label: nextTransaction.label,
          mutations: nextTransaction.mutations,
        });
      }

      this.slots.transactionCommitted.next(committed);
    }
  }

  undo() {
    if (!this.canUndo) {
      return;
    }

    const entry = this.history.popUndo();
    if (!entry) {
      return;
    }

    this._applyingHistory = true;
    try {
      this.transact(
        () => {
          [...entry.mutations].reverse().forEach(mutation => {
            mutation.undo();
          });
        },
        {
          captureHistory: false,
          label: entry.label ?? 'undo',
        }
      );
    } finally {
      this._applyingHistory = false;
    }

    this.history.pushRedo(entry);
  }

  withoutHistory<T>(fn: () => T, label?: string): T {
    return this.transact(fn, {
      captureHistory: false,
      label,
    });
  }

  private _shouldCaptureHistory(transaction: TransactionState) {
    return transaction.captureStack.every(Boolean);
  }
}
