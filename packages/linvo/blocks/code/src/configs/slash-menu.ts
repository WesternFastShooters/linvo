import { type SlashMenuConfig } from '@linvo/linvo-widget-slash-menu';

export const codeSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => {
    return model.flavour === 'linvo:code';
  },
  items: [],
};
