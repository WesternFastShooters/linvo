import { BlockModel } from '@linvo-core/store';
import { defineEmbedModel } from '../../../helpers';
export const EmbedGithubStyles = [
    'vertical',
    'horizontal',
    'list',
    'cube',
];
export class EmbedGithubModel extends defineEmbedModel(BlockModel) {
}
