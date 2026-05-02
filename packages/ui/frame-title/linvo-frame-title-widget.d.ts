import { type FrameBlockModel } from '@linvo-core/content';
import { WidgetComponent } from '@linvo-core/std';
export declare const LINVO_FRAME_TITLE_WIDGET = "linvo-frame-title-widget";
export declare class LinvoFrameTitleWidget extends WidgetComponent<FrameBlockModel> {
    render(): import("lit-html").TemplateResult<1>;
}
export declare const frameTitleWidget: import("@linvo-core/composition").ExtensionType;
