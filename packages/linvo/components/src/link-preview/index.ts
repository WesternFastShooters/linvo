import { LinkPreview } from './link';

export * from './link';

export function effects() {
  customElements.define('linvo-link-preview', LinkPreview);
}
