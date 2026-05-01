import { LinvoError, ErrorCode } from '@linvo/global/exceptions';

import type { IdGenerator } from '../utils/id-generator.js';
import type { Doc } from '../extension/index.js';

export * from './test-doc.js';
export * from './test-meta.js';
export * from './test-workspace.js';

export function createAutoIncrementIdGenerator(): IdGenerator {
  let i = 0;
  return () => (i++).toString();
}

export function initializeTestWorkspaceDoc(
  workspace: import('./test-workspace.js').TestWorkspace,
  docId?: string
): Doc {
  const id = docId ?? workspace.idGenerator();
  const existing = workspace.meta.docMetas[0];

  if (existing && existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc workspace already initialized with doc id ${existing.id}`
    );
  }

  if (!existing) {
    workspace.meta.addDocMeta({
      id,
      title: '',
      createDate: Date.now(),
      tags: [],
    });
  }

  return workspace.doc;
}

export function removeTestWorkspaceDoc(
  workspace: import('./test-workspace.js').TestWorkspace,
  docId?: string
) {
  const existing = workspace.meta.docMetas[0];
  if (!existing) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      'single-doc workspace is not initialized'
    );
  }

  const id = docId ?? existing.id;
  if (existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc workspace does not contain doc id ${id}`
    );
  }

  workspace.doc.dispose();
  workspace.meta.removeDocMeta(id);
}
