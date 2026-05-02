import { ErrorCode, LinvoError } from '@linvo-core/global/exceptions';

import type { Doc, IdGenerator } from '@linvo-core/store';

export * from './test-doc';
export * from './test-meta';
export * from './test-doc-source';

export function createAutoIncrementIdGenerator(): IdGenerator {
  let i = 0;
  return () => (i++).toString();
}

export function initializeTestDocSourceDoc(
  docSource: import('./test-doc-source').TestDocSource,
  docId?: string
): Doc {
  const id = docId ?? docSource.idGenerator();
  const existing = docSource.meta.docMetas[0];

  if (existing && existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc source already initialized with doc id ${existing.id}`
    );
  }

  if (!existing) {
    docSource.meta.addDocMeta({
      id,
      title: '',
      createDate: Date.now(),
      tags: [],
    });
  }

  return docSource.doc;
}

export function removeTestDocSourceDoc(
  docSource: import('./test-doc-source').TestDocSource,
  docId?: string
) {
  const existing = docSource.meta.docMetas[0];
  if (!existing) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      'single-doc source is not initialized'
    );
  }

  const id = docId ?? existing.id;
  if (existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc source does not contain doc id ${id}`
    );
  }

  docSource.doc.dispose();
  docSource.meta.removeDocMeta(id);
}
