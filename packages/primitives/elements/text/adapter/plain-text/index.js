import { ElementToPlainTextAdapterExtension } from '@linvo-core/block-surface';
import { getTextElementText } from '../text';
export const textToPlainTextAdapterMatcher = ElementToPlainTextAdapterExtension({
    name: 'text',
    match: elementModel => elementModel.type === 'text',
    toAST: elementModel => {
        const content = getTextElementText(elementModel);
        return { content };
    },
});
