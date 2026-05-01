import type { TransformerMiddleware } from '@linvo/store';

export const fileNameMiddleware =
  (fileName?: string): TransformerMiddleware =>
  ({ slots }) => {
    const beforeImportSubscription = slots.beforeImport.subscribe(payload => {
      if (payload.type !== 'doc') {
        return;
      }
      if (!fileName) {
        return;
      }
      payload.snapshot.meta.title = fileName;
      payload.snapshot.blocks.props.title = {
        '$linvo:internal:text$': true,
        delta: [
          {
            insert: fileName,
          },
        ],
      };
    });

    return () => {
      beforeImportSubscription.unsubscribe();
    };
  };
