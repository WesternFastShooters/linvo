import {
  EmbedSyncedDocModel,
} from '@linvo-core/content';
import { LinvoError } from '@linvo-core/global/exceptions';
import type {
  AfterImportBlockPayload,
  BeforeImportBlockPayload,
  TransformerMiddleware,
} from '@linvo-core/store';
import { filter, map } from 'rxjs';

import { matchModels } from '../../utils';

export const replaceIdMiddleware =
  (idGenerator: () => string): TransformerMiddleware =>
  ({ slots, docCRUD, assetsManager }) => {
    const idMap = new Map<string, string>();

    // After Import

    const afterImportBlock$ = slots.afterImport.pipe(
      filter(
        (payload): payload is AfterImportBlockPayload =>
          payload.type === 'block'
      ),
      map(({ model }) => model)
    );

    const replaceLinkedDocIdSubscription = afterImportBlock$
      .pipe(filter(model => matchModels(model, [EmbedSyncedDocModel])))
      .subscribe(model => {
        const original = model.props.pageId;
        // If the pageId is not in the doc, generate a new id.
        // If we already have a replacement, use it.
        if (!docCRUD.get(original)) {
          if (idMap.has(original)) {
            model.props.pageId = idMap.get(original)!;
          } else {
            const newId = idGenerator();
            idMap.set(original, newId);
            model.props.pageId = newId;
          }
        }
      });

    // Before Import

    const beforeImportPageSubscription = slots.beforeImport
      .pipe(filter(payload => payload.type === 'doc'))
      .subscribe(payload => {
        if (idMap.has(payload.snapshot.meta.id)) {
          payload.snapshot.meta.id = idMap.get(payload.snapshot.meta.id)!;
          return;
        }
        const newId = idGenerator();
        idMap.set(payload.snapshot.meta.id, newId);
        payload.snapshot.meta.id = newId;
      });

    const beforeImportBlockSubscription = slots.beforeImport
      .pipe(
        filter(
          (payload): payload is BeforeImportBlockPayload =>
            payload.type === 'block'
        )
      )
      .subscribe(payload => {
        const { snapshot } = payload;
        const original = snapshot.id;
        let newId: string;
        if (idMap.has(original)) {
          newId = idMap.get(original)!;
        } else {
          newId = idGenerator();
          idMap.set(original, newId);
        }
        snapshot.id = newId;

        // Should be re-paired.
        if (['linvo:attachment', 'linvo:image'].includes(snapshot.flavour)) {
          if (!assetsManager.uploadingAssetsMap.has(original)) return;

          const data = assetsManager.uploadingAssetsMap.get(original)!;
          assetsManager.uploadingAssetsMap.set(newId, data);
          assetsManager.uploadingAssetsMap.delete(original);
          return;
        }

        if (snapshot.flavour === 'linvo:surface') {
          // Generate new IDs for images and frames in advance.
          snapshot.children.forEach(child => {
            const original = child.id;
            if (idMap.has(original)) {
              newId = idMap.get(original)!;
            } else {
              newId = idGenerator();
              idMap.set(original, newId);
            }
          });

          Object.entries(
            snapshot.props.elements as Record<string, Record<string, unknown>>
          ).forEach(([_, value]) => {
            switch (value.type) {
              case 'connector': {
                let connection = value.source as Record<string, string>;
                if (idMap.has(connection.id)) {
                  const newId = idMap.get(connection.id);
                  if (!newId) {
                    throw new LinvoError(
                      LinvoError.ErrorCode.TransformerError,
                      `reference id must exist: ${connection.id}`
                    );
                  }
                  connection.id = newId;
                }
                connection = value.target as Record<string, string>;
                if (idMap.has(connection.id)) {
                  const newId = idMap.get(connection.id);
                  if (!newId) {
                    throw new LinvoError(
                      LinvoError.ErrorCode.TransformerError,
                      `reference id must exist: ${connection.id}`
                    );
                  }
                  connection.id = newId;
                }
                break;
              }
              case 'group': {
                const json = (value.children as Record<string, unknown>)
                  .json as Record<string, unknown>;
                Object.entries(json).forEach(([key, value]) => {
                  if (idMap.has(key)) {
                    delete json[key];
                    const newKey = idMap.get(key);
                    if (!newKey) {
                      throw new LinvoError(
                        LinvoError.ErrorCode.TransformerError,
                        `reference id must exist: ${key}`
                      );
                    }
                    json[newKey] = value;
                  }
                });
                break;
              }
              default:
                break;
            }
          });
        }
      });

    return () => {
      replaceLinkedDocIdSubscription.unsubscribe();
      beforeImportPageSubscription.unsubscribe();
      beforeImportBlockSubscription.unsubscribe();
    };
  };
