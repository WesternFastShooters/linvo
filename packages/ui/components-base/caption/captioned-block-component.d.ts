import { BlockComponent, type BlockService } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';
import { type StyleInfo } from 'lit/directives/style-map.js';
import type { BlockCaptionEditor } from './block-caption';
export declare enum SelectedStyle {
    Background = "Background",
    Border = "Border"
}
export declare class CaptionedBlockComponent<Model extends BlockModel = BlockModel, Service extends BlockService = BlockService, WidgetName extends string = string> extends BlockComponent<Model, Service, WidgetName> {
    static styles: import("lit").CSSResult;
    get captionEditor(): BlockCaptionEditor<BlockModel<import("./block-caption").BlockCaptionProps>> | undefined;
    constructor();
    private _renderWithWidget;
    private accessor _captionEditorRef;
    protected accessor blockContainerStyles: StyleInfo | undefined;
    protected accessor selectedStyle: SelectedStyle;
    protected accessor useCaptionEditor: boolean;
    protected accessor useZeroWidth: boolean;
}
