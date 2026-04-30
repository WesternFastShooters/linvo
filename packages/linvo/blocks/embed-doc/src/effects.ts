import { EmbedLinkedDocBlockComponent } from './embed-linked-doc-block';
import { EmbedEdgelessLinkedDocBlockComponent } from './embed-linked-doc-block/embed-edgeless-linked-doc-block';
import { EmbedSyncedDocBlockComponent } from './embed-synced-doc-block';
import { EmbedSyncedDocCard } from './embed-synced-doc-block/components/embed-synced-doc-card';
import { EmbedEdgelessSyncedDocBlockComponent } from './embed-synced-doc-block/embed-edgeless-synced-doc-block';

export function effects() {
  customElements.define('linvo-embed-synced-doc-card', EmbedSyncedDocCard);

  customElements.define(
    'linvo-embed-edgeless-linked-doc-block',
    EmbedEdgelessLinkedDocBlockComponent
  );
  customElements.define(
    'linvo-embed-linked-doc-block',
    EmbedLinkedDocBlockComponent
  );

  customElements.define(
    'linvo-embed-edgeless-synced-doc-block',
    EmbedEdgelessSyncedDocBlockComponent
  );
  customElements.define(
    'linvo-embed-synced-doc-block',
    EmbedSyncedDocBlockComponent
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-embed-synced-doc-card': EmbedSyncedDocCard;
    'linvo-embed-synced-doc-block': EmbedSyncedDocBlockComponent;
    'linvo-embed-edgeless-synced-doc-block': EmbedEdgelessSyncedDocBlockComponent;
    'linvo-embed-linked-doc-block': EmbedLinkedDocBlockComponent;
    'linvo-embed-edgeless-linked-doc-block': EmbedEdgelessLinkedDocBlockComponent;
  }
}
