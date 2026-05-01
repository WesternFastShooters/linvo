import {
  NoteBlockModel,
  NoteDisplayMode,
  type RootBlockModel,
} from '@linvo/linvo-model';
import {
  PageViewportService,
  ViewportElementProvider,
} from '@linvo/linvo-shared/services';
import { matchModels } from '@linvo/linvo-shared/utils';
import type { Viewport } from '@linvo/linvo-shared/types';
import { BlockComponent } from '@linvo/std';
import { css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

export class PreviewRootBlockComponent extends BlockComponent<RootBlockModel> {
  static override styles = css`
    linvo-preview-root {
      display: block;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._initViewportResizeEffect();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  get viewportProvider() {
    return this.std.get(ViewportElementProvider);
  }

  get viewport(): Viewport {
    return this.viewportProvider.viewport;
  }

  get viewportElement(): HTMLElement {
    return this.viewportProvider.viewportElement;
  }

  private _initViewportResizeEffect() {
    const viewport = this.viewport;
    const viewportElement = this.viewportElement;
    if (!viewport || !viewportElement) {
      return;
    }

    const viewportService = this.std.get(PageViewportService);
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        for (const { target } of entries) {
          if (target === viewportElement) {
            viewportService.next(viewport);
            break;
          }
        }
      }
    );
    resizeObserver.observe(viewportElement);
    this.disposables.add(() => {
      resizeObserver.unobserve(viewportElement);
      resizeObserver.disconnect();
    });
  }

  override renderBlock() {
    const widgets = html`${repeat(
      Object.entries(this.widgets),
      ([id]) => id,
      ([_, widget]) => widget
    )}`;

    const children = this.renderChildren(this.model, child => {
      const isNote = matchModels(child, [NoteBlockModel]);
      const note = child as NoteBlockModel;
      const displayOnEdgeless =
        !!note.props.displayMode &&
        note.props.displayMode === NoteDisplayMode.EdgelessOnly;
      // Should remove deprecated `hidden` property in the future
      return !(isNote && displayOnEdgeless);
    });

    return html`<div class="linvo-preview-root">${children} ${widgets}</div>`;
  }
}
