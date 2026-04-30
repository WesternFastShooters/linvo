import { CitationCard } from './citation';

export * from './citation';

export function effects() {
  customElements.define('linvo-citation-card', CitationCard);
}
