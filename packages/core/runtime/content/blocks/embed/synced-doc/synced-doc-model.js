import { BlockModel } from '@linvo-core/store';
import { defineEmbedModel } from '../../../helpers';
export const EmbedSyncedDocStyles = [
    'syncedDoc',
];
export class EmbedSyncedDocModel extends defineEmbedModel(BlockModel) {
    get isFolded() {
        return !!this.props.preFoldHeight$.value;
    }
}
