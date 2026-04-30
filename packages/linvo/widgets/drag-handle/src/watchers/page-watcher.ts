import { PageViewportService } from '@linvo/linvo-shared/services';

import type { LinvoDragHandleWidget } from '../drag-handle.js';

export class PageWatcher {
  get pageViewportService() {
    return this.widget.std.get(PageViewportService);
  }

  constructor(readonly widget: LinvoDragHandleWidget) {}

  watch() {
    const { disposables } = this.widget;

    disposables.add(
      this.pageViewportService.subscribe(() => {
        this.widget.hide();
      })
    );
  }
}
