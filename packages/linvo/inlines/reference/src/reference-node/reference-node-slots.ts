import type { ReferenceInfo } from '@linvo/linvo-model';
import type { OpenDocMode } from '@linvo/linvo-shared/services';
import { createIdentifier } from '@linvo/global/di';
import type { EditorHost } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { Subject } from 'rxjs';

export type DocLinkClickedEvent = ReferenceInfo & {
  // default is active view
  openMode?: OpenDocMode;
  event?: MouseEvent;
  host: EditorHost;
};

export type RefNodeSlots = {
  docLinkClicked: Subject<DocLinkClickedEvent>;
};

export const RefNodeSlotsProvider =
  createIdentifier<RefNodeSlots>('LinvoRefNodeSlots');

const slots: RefNodeSlots = {
  docLinkClicked: new Subject(),
};

export const RefNodeSlotsExtension: ExtensionType = {
  setup: di => {
    di.addImpl(RefNodeSlotsProvider, () => slots);
  },
};
