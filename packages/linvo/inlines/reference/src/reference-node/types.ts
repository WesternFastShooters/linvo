import type { ReferenceInfo } from '@linvo/linvo-model';
import type { OpenDocMode } from '@linvo/linvo-shared/services';
import type { EditorHost } from '@linvo/std';
import type { Subject } from 'rxjs';

export type DocLinkClickedEvent = ReferenceInfo & {
  // default is active view
  openMode?: OpenDocMode;
  event?: MouseEvent;
  host: EditorHost;
};

export type RefNodeSlots = {
  docLinkClicked: Subject<DocLinkClickedEvent>;
};
