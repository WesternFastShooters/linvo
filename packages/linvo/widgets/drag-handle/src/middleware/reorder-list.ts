import { correctNumberedListsOrderToPrev } from '@linvo/linvo-block-list';
import { ListBlockModel } from '@linvo/linvo-model';
import { matchModels } from '@linvo/linvo-shared/utils';
import type { BlockStdScope } from '@linvo/std';
import type { TransformerMiddleware } from '@linvo/store';

export const reorderList =
  (std: BlockStdScope): TransformerMiddleware =>
  ({ slots }) => {
    const afterImportBlockSubscription = slots.afterImport.subscribe(
      payload => {
        if (payload.type === 'block') {
          const model = payload.model;
          if (
            matchModels(model, [ListBlockModel]) &&
            model.props.type === 'numbered'
          ) {
            const next = std.store.getNext(model);
            correctNumberedListsOrderToPrev(std.store, model);
            if (next) {
              correctNumberedListsOrderToPrev(std.store, next);
            }
          }
        }
      }
    );

    return () => {
      afterImportBlockSubscription.unsubscribe();
    };
  };
