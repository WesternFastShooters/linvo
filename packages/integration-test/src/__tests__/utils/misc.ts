import { LinvoSchemas } from '@linvo/linvo/schemas';
import { replaceIdMiddleware } from '@linvo/linvo/shared/adapters';
import { createSingleDocCRUD } from '@linvo/linvo/shared/utils';
import {
  type DocSnapshot,
  Schema,
  Transformer,
  type Workspace,
} from '@linvo/store';

export async function importFromSnapshot(
  collection: Workspace,
  snapshot: DocSnapshot
) {
  const job = new Transformer({
    schema: new Schema().register(LinvoSchemas),
    blobCRUD: collection.blobSync,
    docCRUD: createSingleDocCRUD(collection),
    middlewares: [replaceIdMiddleware(collection.idGenerator)],
  });

  return job.snapshotToDoc(snapshot);
}
