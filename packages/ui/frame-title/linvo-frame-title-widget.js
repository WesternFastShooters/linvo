import {} from '@linvo-core/content';
import { WidgetComponent, WidgetViewExtension } from '@linvo-core/std';
import { html } from 'lit';
import { literal, unsafeStatic } from 'lit/static-html.js';
export const LINVO_FRAME_TITLE_WIDGET = 'linvo-frame-title-widget';
export class LinvoFrameTitleWidget extends WidgetComponent {
    render() {
        return html `<linvo-frame-title
      .model=${this.model}
      data-id=${this.model.id}
    ></linvo-frame-title>`;
    }
}
export const frameTitleWidget = WidgetViewExtension('linvo:frame', LINVO_FRAME_TITLE_WIDGET, literal `${unsafeStatic(LINVO_FRAME_TITLE_WIDGET)}`);
