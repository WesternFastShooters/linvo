import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import type { AbstractDocSource } from '@linvo-core/store';
import type { Store } from '@linvo-core/store';

type DocSourceCRUD = {
  create: (id: string) => Store;
  get: (id: string) => Store | null;
  delete: (id: string) => void;
};

export function getDocSourceDoc(
  docSource: AbstractDocSource,
  docId: string
) {
  return docSource.doc.id === docId ? docSource.doc : null;
}

export function createDocSourceCRUD(source: AbstractDocSource): DocSourceCRUD {
  return {
    create: (id: string) => {
      const doc = getDocSourceDoc(source, id);
      if (!doc) {
        throw new LinvoError(
          ErrorCode.DocCollectionError,
          `single-doc source cannot create doc ${id}`
        );
      }
      return doc.getStore({ id: doc.id });
    },
    get: (id: string) => {
      const doc = getDocSourceDoc(source, id);
      return doc?.getStore({ id: doc.id }) ?? null;
    },
    delete: (id: string) => {
      if (source.doc.id !== id) {
        return;
      }
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        'single-doc source does not support deleting the current doc'
      );
    },
  };
}

export function createDefaultDoc(
  _source: AbstractDocSource,
  options: { id?: string; title?: string } = {}
): Store {
  throw new LinvoError(
    ErrorCode.DocCollectionError,
    `single-doc source does not support creating a new doc${
      options.id ? ` (${options.id})` : ''
    }`
  );
}
