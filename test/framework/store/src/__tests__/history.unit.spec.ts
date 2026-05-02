import { describe, expect, test } from 'vitest';

import {
  createAutoIncrementIdGenerator,
  initializeTestDocSourceDoc,
} from '@linvo/test-framework-store/testing';
import { TestDocSource } from '@linvo/test-framework-store/testing';
import {
  NoteBlockSchemaExtension,
  ItemBlockSchemaExtension,
  RootBlockSchemaExtension,
} from './test-schema';

const extensions = [
  RootBlockSchemaExtension,
  NoteBlockSchemaExtension,
  ItemBlockSchemaExtension,
];

function createStore() {
  const docSource = new TestDocSource({
    id: 'history-doc-source',
    idGenerator: createAutoIncrementIdGenerator(),
  });

  docSource.meta.initialize();

  const doc = initializeTestDocSourceDoc(docSource, 'history-doc');
  doc.load();

  const store = doc.getStore({
    extensions,
  });

  store.addBlock('linvo:root');

  return {
    store,
    docSource,
  };
}

describe('history extension', () => {
  test('undo and redo block creation', async () => {
    const { store, docSource } = createStore();
    const noteId = store.addBlock('linvo:note', {}, store.root);

    expect(store.getModelById(noteId)).not.toBeNull();
    expect(store.canUndo).toBe(true);

    await store.undo();
    expect(store.getModelById(noteId)).toBeNull();
    expect(store.canRedo).toBe(true);

    await store.redo();
    expect(store.getModelById(noteId)).not.toBeNull();

    docSource.dispose();
  });

  test('undo and redo block updates', async () => {
    const { store, docSource } = createStore();
    const noteId = store.addBlock('linvo:note', {}, store.root);
    const itemId = store.addBlock(
      'linvo:item',
      {
        type: 'text',
        text: 'before',
      },
      noteId
    );

    const item = store.getModelById(itemId);
    expect(item?.text?.toString()).toBe('before');

    store.updateBlock(itemId, {
      text: 'after',
    });

    expect(store.getModelById(itemId)?.text?.toString()).toBe('after');

    await store.undo();
    expect(store.getModelById(itemId)?.text?.toString()).toBe('before');

    await store.redo();
    expect(store.getModelById(itemId)?.text?.toString()).toBe('after');

    docSource.dispose();
  });

  test('reset history clears undo and redo stacks', async () => {
    const { store, docSource } = createStore();
    store.addBlock('linvo:note', {}, store.root);

    expect(store.canUndo).toBe(true);

    store.resetHistory();

    expect(store.canUndo).toBe(false);
    expect(store.canRedo).toBe(false);

    await store.undo();
    expect(store.canUndo).toBe(false);

    docSource.dispose();
  });
});
