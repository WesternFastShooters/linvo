import { literal } from 'lit/static-html.js';
import { describe, expect, it, vi } from 'vitest';

import { BlockSchemaExtension } from '@linvo-core/store';
import { defineBlockSchema } from '@linvo-core/store';
// import some blocks
import { SchemaValidateError } from '@linvo-core/store';
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

function createTestOptions() {
  const idGenerator = createAutoIncrementIdGenerator();
  return { id: 'test-collection', idGenerator };
}

const TestCustomNoteBlockSchema = defineBlockSchema({
  flavour: 'linvo:note-block-video',
  props: internal => ({
    text: internal.Text(),
  }),
  metadata: {
    version: 1,
    role: 'content',
    tag: literal`linvo-note-block-video`,
    parent: ['linvo:note'],
  },
});

const TestCustomNoteBlockSchemaExtension = BlockSchemaExtension(
  TestCustomNoteBlockSchema
);

const TestInvalidNoteBlockSchema = defineBlockSchema({
  flavour: 'linvo:note-invalid-block-video',
  props: internal => ({
    text: internal.Text(),
  }),
  metadata: {
    version: 1,
    role: 'content',
    tag: literal`linvo-invalid-note-block-video`,
    parent: ['linvo:note'],
  },
});

const TestInvalidNoteBlockSchemaExtension = BlockSchemaExtension(
  TestInvalidNoteBlockSchema
);

const TestRoleBlockSchema = defineBlockSchema({
  flavour: 'linvo:note-block-role-test',
  metadata: {
    version: 1,
    role: 'content',
    parent: ['linvo:note'],
    children: ['@test'],
  },
  props: internal => ({
    text: internal.Text(),
  }),
});

const TestRoleBlockSchemaExtension = BlockSchemaExtension(TestRoleBlockSchema);

const TestItemBlockSchema = defineBlockSchema({
  flavour: 'linvo:test-item',
  metadata: {
    version: 1,
    role: 'test',
    parent: ['@content'],
  },
});

const TestItemBlockSchemaExtension = BlockSchemaExtension(
  TestItemBlockSchema
);

const extensions = [
  RootBlockSchemaExtension,
  ItemBlockSchemaExtension,
  NoteBlockSchemaExtension,
  TestCustomNoteBlockSchemaExtension,
  TestInvalidNoteBlockSchemaExtension,
  TestRoleBlockSchemaExtension,
  TestItemBlockSchemaExtension,
];

const defaultDocId = 'doc0';
function createTestDoc(docId = defaultDocId) {
  const options = createTestOptions();
  const collection = new TestDocSource(options);
  collection.meta.initialize();
  const doc = initializeTestDocSourceDoc(collection, docId);
  doc.load();
  const store = doc.getStore({ extensions });
  return store;
}

describe('schema', () => {
  it('should be able to validate schema by role', () => {
    const consoleMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const doc = createTestDoc();
    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    const itemId = doc.addBlock('linvo:item', {}, noteId);

    doc.addBlock('linvo:note', {});
    expect(consoleMock.mock.calls[0]).toSatisfy((call: unknown[]) => {
      return typeof call[0] === 'string';
    });
    expect(consoleMock.mock.calls[1]).toSatisfy((call: unknown[]) => {
      return call[0] instanceof SchemaValidateError;
    });

    consoleMock.mockClear();
    // add paragraph to root should throw
    doc.addBlock('linvo:item', {}, rootId);
    expect(consoleMock.mock.calls[0]).toSatisfy((call: unknown[]) => {
      return typeof call[0] === 'string';
    });
    expect(consoleMock.mock.calls[1]).toSatisfy((call: unknown[]) => {
      return call[0] instanceof SchemaValidateError;
    });

    consoleMock.mockClear();
    doc.addBlock('linvo:note', {}, rootId);
    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, itemId);
    expect(consoleMock).not.toBeCalled();
  });

  it('should glob match works', () => {
    const consoleMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const doc = createTestDoc();
    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);

    doc.addBlock('linvo:note-block-video', {}, noteId);
    expect(consoleMock).not.toBeCalled();

    doc.addBlock('linvo:note-invalid-block-video', {}, noteId);
    expect(consoleMock.mock.calls[0]).toSatisfy((call: unknown[]) => {
      return typeof call[0] === 'string';
    });
    expect(consoleMock.mock.calls[1]).toSatisfy((call: unknown[]) => {
      return call[0] instanceof SchemaValidateError;
    });
  });

  it('should be able to validate schema by role', () => {
    const consoleMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const doc = createTestDoc();
    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    const roleId = doc.addBlock('linvo:note-block-role-test', {}, noteId);

    doc.addBlock('linvo:item', {}, roleId);
    doc.addBlock('linvo:item', {}, roleId);

    expect(consoleMock.mock.calls[1]).toSatisfy((call: unknown[]) => {
      return call[0] instanceof SchemaValidateError;
    });

    consoleMock.mockClear();
    doc.addBlock('linvo:test-item', {}, roleId);
    doc.addBlock('linvo:test-item', {}, roleId);
    expect(consoleMock).not.toBeCalled();

    expect(doc.getBlocksByFlavour('linvo:test-item')).toHaveLength(2);
  });
});
