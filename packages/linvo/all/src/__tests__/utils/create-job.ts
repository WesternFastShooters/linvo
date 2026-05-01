import { defaultImageProxyMiddleware } from '@linvo/linvo-shared/adapters';
import { createSingleDocCRUD } from '@linvo/linvo-shared/utils';
import {
  Schema,
  Transformer,
  type TransformerMiddleware,
} from '@linvo/store';
import { TestWorkspace } from '@linvo/store/test';

import { LinvoSchemas } from '../../schemas.js';
import { testStoreExtensions } from './store.js';

declare global {
  interface Window {
    happyDOM: {
      settings: {
        fetch: {
          disableSameOriginPolicy: boolean;
        };
      };
    };
  }
}

export function createJob(middlewares?: TransformerMiddleware[]) {
  window.happyDOM.settings.fetch.disableSameOriginPolicy = true;
  const testMiddlewares = middlewares ?? [];
  testMiddlewares.push(defaultImageProxyMiddleware);
  const schema = new Schema().register(LinvoSchemas);
  const docCollection = new TestWorkspace();
  docCollection.storeExtensions = testStoreExtensions;
  docCollection.meta.initialize();
  return new Transformer({
    schema,
    blobCRUD: docCollection.blobSync,
    middlewares: testMiddlewares,
    docCRUD: createSingleDocCRUD(docCollection),
  });
}
