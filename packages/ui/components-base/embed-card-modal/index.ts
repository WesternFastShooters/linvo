import { defineCustomElement } from '@linvo-core/global/utils';
import { EmbedCardCreateModal } from './embed-card-create-modal';
import { EmbedCardEditModal } from './embed-card-edit-modal';

export * from './embed-card-create-modal';
export * from './embed-card-edit-modal';

export function effects() {
  defineCustomElement('embed-card-create-modal', EmbedCardCreateModal);
  defineCustomElement('embed-card-edit-modal', EmbedCardEditModal);
}
