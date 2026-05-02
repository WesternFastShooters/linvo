import { BlockSchemaExtension } from '@linvo-core/store';
import { createEmbedBlockSchema } from '../../../helpers';
import { EmbedHtmlModel, EmbedHtmlStyles, } from './html-model';
const defaultEmbedHtmlProps = {
    style: EmbedHtmlStyles[0],
    caption: null,
    html: undefined,
    design: undefined,
};
export const EmbedHtmlBlockSchema = createEmbedBlockSchema({
    name: 'html',
    version: 1,
    toModel: () => new EmbedHtmlModel(),
    props: () => defaultEmbedHtmlProps,
});
export const EmbedHtmlBlockSchemaExtension = BlockSchemaExtension(EmbedHtmlBlockSchema);
