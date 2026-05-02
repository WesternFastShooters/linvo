import { BlockSchemaExtension } from '@linvo-core/store';
import { createEmbedBlockSchema } from '../../../helpers';
import { EmbedYoutubeModel, EmbedYoutubeStyles, } from './youtube-model';
const defaultEmbedYoutubeProps = {
    style: EmbedYoutubeStyles[0],
    url: '',
    caption: null,
    image: null,
    title: null,
    description: null,
    creator: null,
    creatorUrl: null,
    creatorImage: null,
    videoId: null,
};
export const EmbedYoutubeBlockSchema = createEmbedBlockSchema({
    name: 'youtube',
    version: 1,
    toModel: () => new EmbedYoutubeModel(),
    props: () => defaultEmbedYoutubeProps,
});
export const EmbedYoutubeBlockSchemaExtension = BlockSchemaExtension(EmbedYoutubeBlockSchema);
