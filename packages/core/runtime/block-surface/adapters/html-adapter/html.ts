import {
  BlockHtmlAdapterExtension,
  type BlockHtmlAdapterMatcher,
} from '@linvo-core/shared/adapters';

export const surfaceBlockHtmlAdapterMatcher: BlockHtmlAdapterMatcher = {
  flavour: 'linvo:surface',
  toMatch: () => false,
  fromMatch: o => o.node.flavour === 'linvo:surface',
  toBlockSnapshot: {},
  fromBlockSnapshot: {
    enter: (_, context) => {
      context.walkerContext.skipAllChildren();
    },
  },
};

export const SurfaceBlockHtmlAdapterExtension = BlockHtmlAdapterExtension(
  surfaceBlockHtmlAdapterMatcher
);
