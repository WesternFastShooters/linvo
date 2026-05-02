import type { TransformerMiddleware } from '@linvo-core/store';

const customDocLinkBaseUrlMiddleware = (
  baseUrl: string,
  sourceId: string
): TransformerMiddleware => {
  return ({ adapterConfigs }) => {
    const docLinkBaseUrl = baseUrl
      ? `${baseUrl}/workspace/${sourceId}`
      : '';
    adapterConfigs.set('docLinkBaseUrl', docLinkBaseUrl);
  };
};

export const docLinkBaseURLMiddlewareBuilder = (
  baseUrl: string,
  sourceId: string
) => {
  let middleware = customDocLinkBaseUrlMiddleware(baseUrl, sourceId);
  return {
    get: () => middleware,
    set: (url: string) => {
      middleware = customDocLinkBaseUrlMiddleware(url, sourceId);
    },
  };
};

const defaultDocLinkBaseURLMiddlewareBuilder = (sourceId: string) =>
  docLinkBaseURLMiddlewareBuilder(
    typeof window !== 'undefined' ? window.location.origin : '.',
    sourceId
  );

export const docLinkBaseURLMiddleware = (sourceId: string) =>
  defaultDocLinkBaseURLMiddlewareBuilder(sourceId).get();

export const setDocLinkBaseURLMiddleware = (sourceId: string) =>
  defaultDocLinkBaseURLMiddlewareBuilder(sourceId).set;

export const embedSyncedDocMiddleware =
  (type: 'content'): TransformerMiddleware =>
  ({ adapterConfigs }) => {
    adapterConfigs.set('embedSyncedDocExportType', type);
  };
