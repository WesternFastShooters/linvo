import {
  createAutoIncrementIdGenerator,
  initializeTestDocSourceDoc,
  TestDocSource,
} from '@linvo/test-framework-store/testing';
import { describe, expect, test } from 'vitest';

import { effects } from '@linvo-core/std/effects';
import { TestEditorContainer } from './test-editor';
import {
  type TitleBlockModel,
  TitleBlockSchemaExtension,
  NoteBlockSchemaExtension,
  RootBlockSchemaExtension,
  SurfaceBlockSchemaExtension,
} from './test-schema';
import { testSpecs } from './test-spec';

effects();

const extensions = [
  RootBlockSchemaExtension,
  NoteBlockSchemaExtension,
  TitleBlockSchemaExtension,
  SurfaceBlockSchemaExtension,
];

function createTestOptions() {
  const idGenerator = createAutoIncrementIdGenerator();
  return { id: 'test-collection', idGenerator };
}

function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

describe('editor host', () => {
  test('editor host should rerender model when view changes', async () => {
    const collection = new TestDocSource(createTestOptions());

    collection.meta.initialize();
    const doc = initializeTestDocSourceDoc(collection, 'home');
    const store = doc.getStore({ extensions });
    doc.load();
    const rootId = store.addBlock('test:root');
    const noteId = store.addBlock('test:note', {}, rootId);
    const titleId = store.addBlock('test:title', { type: 'h1' }, noteId);
    const titleBlock = store.getBlock(titleId)!;

    const editorContainer = new TestEditorContainer();
    editorContainer.doc = store;
    editorContainer.specs = testSpecs;

    document.body.append(editorContainer);

    await wait(50);
    let titleElm = editorContainer.std.view.getBlock(titleId);

    expect(titleElm!.tagName).toBe('TEST-TITLE-H1-BLOCK');

    (titleBlock.model as TitleBlockModel).props.type = 'h2';
    await wait(50);
    titleElm = editorContainer.std.view.getBlock(titleId);

    expect(titleElm!.tagName).toBe('TEST-TITLE-H2-BLOCK');
  });
});
