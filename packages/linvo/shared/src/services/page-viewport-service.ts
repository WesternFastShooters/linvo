import { createIdentifier } from '@linvo/global/di';
import type { ExtensionType } from '@linvo/store';
import { Subject } from 'rxjs';

import type { Viewport } from '../types';

export const PageViewportService = createIdentifier<Subject<Viewport>>(
  'PageViewportService'
);

export const PageViewportServiceExtension: ExtensionType = {
  setup: di => {
    di.addImpl(PageViewportService, () => new Subject<Viewport>());
  },
};
