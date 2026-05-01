import { LinvoError, ErrorCode } from '@linvo/global/exceptions';
import type { Workspace } from '@linvo/store';
import type { Store } from '@linvo/store';

type SingleDocCRUD = {
  create: (id: string) => Store;
  get: (id: string) => Store | null;
  delete: (id: string) => void;
};

export function getWorkspaceDoc(
  workspace: Workspace,
  docId: string
) {
  return workspace.doc.id === docId ? workspace.doc : null;
}

export function createSingleDocCRUD(workspace: Workspace): SingleDocCRUD {
  return {
    create: (id: string) => {
      const doc = getWorkspaceDoc(workspace, id);
      if (!doc) {
        throw new LinvoError(
          ErrorCode.DocCollectionError,
          `single-doc workspace cannot create doc ${id}`
        );
      }
      return doc.getStore({ id: doc.id });
    },
    get: (id: string) => {
      const doc = getWorkspaceDoc(workspace, id);
      return doc?.getStore({ id: doc.id }) ?? null;
    },
    delete: (id: string) => {
      if (workspace.doc.id !== id) {
        return;
      }
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        'single-doc workspace does not support deleting the current doc'
      );
    },
  };
}

export function createDefaultDoc(
  _collection: Workspace,
  options: { id?: string; title?: string } = {}
): Store {
  throw new LinvoError(
    ErrorCode.DocCollectionError,
    `single-doc workspace does not support creating a new doc${
      options.id ? ` (${options.id})` : ''
    }`
  );
}
