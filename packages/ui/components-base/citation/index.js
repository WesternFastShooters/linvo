import { defineCustomElement } from '@linvo-core/global/utils';
import { CitationCard } from './citation';
export * from './citation';
export function effects() {
    defineCustomElement('linvo-citation-card', CitationCard);
}
