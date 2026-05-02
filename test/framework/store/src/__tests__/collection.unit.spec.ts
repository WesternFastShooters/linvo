import type { Subject } from 'rxjs';
import { assert, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyUpdate,
  type Doc,
  encodeStateAsUpdate,
} from '@linvo-core/store/compat';

import type { BlockModel, DocMeta, Store } from '@linvo-core/store';
import { Text } from '@linvo-core/store';
import {
  createAutoIncrementIdGenerator,
  initializeTestDocSourceDoc,
  removeTestDocSourceDoc,
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

const defaultDocId = 'doc:home';
const spaceMetaId = 'meta';

function serializCollection(doc: Doc): Record<string, any> {
  return doc.toJSON();
}

function serializBlocks(doc: Doc) {
  return serializCollection(doc).blocks;
}

function waitOnce<T>(slot: Subject<T>) {
  return new Promise<T>(resolve => {
    const subscription = slot.subscribe(val => {
      subscription.unsubscribe();
      resolve(val);
    });
  });
}

function createRoot(doc: Store) {
  doc.addBlock('linvo:root');
  if (!doc.root) throw new Error('root not found');
  return doc.root;
}

const extensions = [
  NoteBlockSchemaExtension,
  ItemBlockSchemaExtension,
  RootBlockSchemaExtension,
];

function createTestDoc(docId = defaultDocId) {
  const options = createTestOptions();
  const collection = new TestDocSource(options);
  collection.meta.initialize();
  const doc = initializeTestDocSourceDoc(collection, docId);
  const store = doc.getStore({
    extensions,
  });
  doc.load();
  return store;
}

function requestIdleCallbackPolyfill(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
) {
  const timeout = options?.timeout ?? 1000;
  const start = Date.now();
  return setTimeout(function () {
    callback({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, timeout - (Date.now() - start));
      },
    });
  }, timeout) as unknown as number;
}

beforeEach(() => {
  if (globalThis.requestIdleCallback === undefined) {
    globalThis.requestIdleCallback = requestIdleCallbackPolyfill;
  }
});

describe('basic', () => {
  it('can init collection', () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();

    const doc = initializeTestDocSourceDoc(collection, 'doc:home');
    doc.load();
    const actual = serializCollection(collection.docState);
    const actualDoc = actual[spaceMetaId].doc as DocMeta;

    assert.equal(typeof actualDoc.createDate, 'number');
    // @ts-expect-error ignore
    delete actualDoc.createDate;

    assert.deepEqual(actual, {
      [spaceMetaId]: {
        doc: {
          id: 'doc:home',
          title: '',
          tags: [],
        },
        properties: {
          tags: {
            options: [],
          },
        },
      },
      blocks: {},
    });
  });

  it('init collection with custom id generator', () => {
    const options = createTestOptions();
    let id = 100;
    const collection = new TestDocSource({
      ...options,
      idGenerator: () => {
        return String(id++);
      },
    });
    collection.meta.initialize();
    {
      const doc = initializeTestDocSourceDoc(collection);
      assert.equal(doc.id, '100');
    }
    expect(() => initializeTestDocSourceDoc(collection, '101')).toThrow(
      /single-doc source already initialized/
    );
  });

  it('doc ready lifecycle', () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();
    const doc = initializeTestDocSourceDoc(collection, 'space:0');
    const store = doc.getStore({
      extensions,
    });

    const readyCallback = vi.fn();
    const rootAddedCallback = vi.fn();
    store.slots.ready.subscribe(readyCallback);
    store.slots.rootAdded.subscribe(rootAddedCallback);

    store.load(() => {
      const rootId = store.addBlock('linvo:root', {
        title: new Text(),
      });
      expect(rootAddedCallback).toBeCalledTimes(1);

      store.addBlock('linvo:note', {}, rootId);
    });

    expect(readyCallback).toBeCalledTimes(1);
  });

  it('collection docs with encoded state applyUpdate', () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();
    const collection2 = new TestDocSource(options);
    const doc = initializeTestDocSourceDoc(collection, 'space:0');
    const store = doc.getStore({
      extensions,
    });
    doc.load(() => {
      store.addBlock('linvo:root', {
        title: new Text(),
      });
    });
    const update = encodeStateAsUpdate(collection.docState);
    applyUpdate(collection2.docState, update);
    const doc2 = collection2.doc;
    if (!doc2) {
      throw new Error('doc2 is not found');
    }
    expect(serializBlocks(collection2.docState)).toEqual({
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': [],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
    });
  });
});

describe('addBlock', () => {
  it('can add single model', () => {
    const doc = createTestDoc();
    doc.addBlock('linvo:root', {
      title: new Text(),
    });

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': [],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
    });
  });

  it('can add model with props', () => {
    const doc = createTestDoc();
    doc.addBlock('linvo:root', { title: new Text('hello') });

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'sys:children': [],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'prop:title': 'hello',
        'sys:version': 2,
      },
    });
  });

  it('can add multi models', () => {
    const doc = createTestDoc();
    const rootId = doc.addBlock('linvo:root', {
      title: new Text(),
    });
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlocks(
      [
        { flavour: 'linvo:item', blockProps: { type: 'h1' } },
        { flavour: 'linvo:item', blockProps: { type: 'h2' } },
      ],
      noteId
    );

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'prop:title': '',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['2', '3', '4'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '2': {
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '2',
        'prop:text': '',
        'prop:type': 'text',
        'sys:version': 1,
      },
      '3': {
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'prop:text': '',
        'prop:type': 'h1',
        'sys:version': 1,
      },
      '4': {
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '4',
        'prop:text': '',
        'prop:type': 'h2',
        'sys:version': 1,
      },
    });
  });

  it('can observe slot events', async () => {
    const doc = createTestDoc();

    queueMicrotask(() =>
      doc.addBlock('linvo:root', {
        title: new Text(),
      })
    );
    const blockId = await waitOnce(doc.slots.rootAdded);
    const block = doc.getModelById(blockId) as BlockModel;
    assert.equal(block.flavour, 'linvo:root');
  });

  it('can add block to root', async () => {
    const doc = createTestDoc();

    let noteId: string;

    queueMicrotask(() => {
      const rootId = doc.addBlock('linvo:root');
      noteId = doc.addBlock('linvo:note', {}, rootId);
    });
    await waitOnce(doc.slots.rootAdded);
    const { root } = doc;
    if (!root) throw new Error('root is null');

    assert.equal(root.flavour, 'linvo:root');

    doc.addBlock('linvo:item', {}, noteId!);
    assert.equal(root.children[0].flavour, 'linvo:note');
    assert.equal(root.children[0].children[0].flavour, 'linvo:item');
    assert.equal(root.childMap.value.get('1'), 0);

    const serializedChildren = serializBlocks(doc.docState)['0']['sys:children'];
    assert.deepEqual(serializedChildren, ['1']);
    assert.equal(root.children[0].id, '1');
  });

  it('rejects a second doc in single-doc mode', async () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();

    const doc0 = initializeTestDocSourceDoc(collection, 'doc:home');
    await doc0.load();
    assert.equal(collection.doc.id, 'doc:home');
    const store0 = doc0.getStore({
      extensions,
    });

    store0.addBlock('linvo:root', {
      title: new Text(),
    });
    expect(() => initializeTestDocSourceDoc(collection, 'space:doc1')).toThrow(
      /single-doc source already initialized/
    );
    removeTestDocSourceDoc(collection, doc0.id);
    expect(() => collection.doc).toThrow();
  });

  it('can remove doc that has not been loaded', () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();

    const doc0 = initializeTestDocSourceDoc(collection, 'doc:home');
    removeTestDocSourceDoc(collection, doc0.id);
    expect(() => collection.doc).toThrow();
  });

  it('can set doc state', () => {
    const options = createTestOptions();
    const collection = new TestDocSource(options);
    collection.meta.initialize();
    initializeTestDocSourceDoc(collection, 'doc:home');

    assert.deepEqual(
      collection.meta.docMetas.map(({ id, title }) => ({
        id,
        title,
      })),
      [
        {
          id: 'doc:home',
          title: '',
        },
      ]
    );

    let called = false;
    collection.slots.docListUpdated.subscribe(() => {
      called = true;
    });

    collection.meta.setDocMeta('doc:home', { favorite: true });
    assert.deepEqual(
      collection.meta.docMetas.map(({ id, title, favorite }) => ({
        id,
        title,
        favorite,
      })),
      [
        {
          id: 'doc:home',
          title: '',
          favorite: true,
        },
      ]
    );
    assert.ok(called);
  });
});

describe('deleteBlock', () => {
  it('delete children recursively by default', () => {
    const doc = createTestDoc();

    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, noteId);
    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['2', '3'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '2': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '2',
        'sys:version': 1,
      },
      '3': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'sys:version': 1,
      },
    });

    const deletedModel = doc.getModelById('1') as BlockModel;
    doc.deleteBlock(deletedModel);

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': [],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
    });
  });

  it('bring children to parent', () => {
    const doc = createTestDoc();

    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    const p1 = doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, p1);
    doc.addBlock('linvo:item', {}, p1);

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['2'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '2': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': ['3', '4'],
        'sys:flavour': 'linvo:item',
        'sys:id': '2',
        'sys:version': 1,
      },
      '3': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'sys:version': 1,
      },
      '4': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '4',
        'sys:version': 1,
      },
    });

    const deletedModel = doc.getModelById('2') as BlockModel;
    const deletedModelParent = doc.getModelById('1') as BlockModel;
    doc.deleteBlock(deletedModel, {
      bringChildrenTo: deletedModelParent,
    });

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['3', '4'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '3': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'sys:version': 1,
      },
      '4': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '4',
        'sys:version': 1,
      },
    });
  });

  it('bring children to other block', () => {
    const doc = createTestDoc();

    const rootId = doc.addBlock('linvo:root', {});
    const noteId = doc.addBlock('linvo:note', {}, rootId);
    const p1 = doc.addBlock('linvo:item', {}, noteId);
    const p2 = doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, p1);
    doc.addBlock('linvo:item', {}, p1);
    doc.addBlock('linvo:item', {}, p2);

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['2', '3'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '2': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': ['4', '5'],
        'sys:flavour': 'linvo:item',
        'sys:id': '2',
        'sys:version': 1,
      },
      '3': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': ['6'],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'sys:version': 1,
      },
      '4': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '4',
        'sys:version': 1,
      },
      '5': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '5',
        'sys:version': 1,
      },
      '6': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '6',
        'sys:version': 1,
      },
    });

    const deletedModel = doc.getModelById('2') as BlockModel;
    const moveToModel = doc.getModelById('3') as BlockModel;
    doc.deleteBlock(deletedModel, {
      bringChildrenTo: moveToModel,
    });

    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['3'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '3': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': ['6', '4', '5'],
        'sys:flavour': 'linvo:item',
        'sys:id': '3',
        'sys:version': 1,
      },
      '4': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '4',
        'sys:version': 1,
      },
      '5': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '5',
        'sys:version': 1,
      },
      '6': {
        'prop:text': '',
        'prop:type': 'text',
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '6',
        'sys:version': 1,
      },
    });
  });

  it('can delete model with parent', () => {
    const doc = createTestDoc();
    const rootModel = createRoot(doc);
    const noteId = doc.addBlock('linvo:note', {}, rootModel.id);

    doc.addBlock('linvo:item', {}, noteId);

    // before delete
    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': ['2'],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
      '2': {
        'sys:children': [],
        'sys:flavour': 'linvo:item',
        'sys:id': '2',
        'prop:text': '',
        'prop:type': 'text',
        'sys:version': 1,
      },
    });

    doc.deleteBlock(rootModel.children[0].children[0]);

    // after delete
    assert.deepEqual(serializBlocks(doc.docState), {
      '0': {
        'prop:count': 0,
        'prop:items': [],
        'prop:style': {},
        'prop:title': '',
        'sys:children': ['1'],
        'sys:flavour': 'linvo:root',
        'sys:id': '0',
        'sys:version': 2,
      },
      '1': {
        'sys:children': [],
        'sys:flavour': 'linvo:note',
        'sys:id': '1',
        'sys:version': 1,
      },
    });
    assert.equal(rootModel.children.length, 1);
  });
});

describe('getBlock', () => {
  it('can get block by id', () => {
    const doc = createTestDoc();
    const rootModel = createRoot(doc);
    const noteId = doc.addBlock('linvo:note', {}, rootModel.id);

    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, noteId);

    const text = doc.getModelById('3') as BlockModel;
    assert.equal(text.flavour, 'linvo:item');
    assert.equal(rootModel.children[0].children.indexOf(text), 1);

    const invalid = doc.getModelById('😅');
    assert.equal(invalid, null);
  });

  it('can get parent', () => {
    const doc = createTestDoc();
    const rootModel = createRoot(doc);
    const noteId = doc.addBlock('linvo:note', {}, rootModel.id);

    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, noteId);

    const result = doc.getParent(
      rootModel.children[0].children[1]
    ) as BlockModel;
    assert.equal(result, rootModel.children[0]);

    const invalid = doc.getParent(rootModel);
    assert.equal(invalid, null);
  });

  it('can get previous sibling', () => {
    const doc = createTestDoc();
    const rootModel = createRoot(doc);
    const noteId = doc.addBlock('linvo:note', {}, rootModel.id);

    doc.addBlock('linvo:item', {}, noteId);
    doc.addBlock('linvo:item', {}, noteId);

    const result = doc.getPrev(rootModel.children[0].children[1]) as BlockModel;
    assert.equal(result, rootModel.children[0].children[0]);

    const invalid = doc.getPrev(rootModel.children[0].children[0]);
    assert.equal(invalid, null);
  });
});
