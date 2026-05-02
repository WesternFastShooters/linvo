import type { BlockCaptionEditor } from '@linvo-ui/components/caption';
import { ResourceController } from '@linvo-ui/components/resource';
import { type ImageBlockModel } from '@linvo-core/content';
import { GfxBlockComponent } from '@linvo-core/std';
export declare class ImageEdgelessBlockComponent extends GfxBlockComponent<ImageBlockModel> {
    static styles: import("lit").CSSResult;
    resourceController: ResourceController;
    get blobUrl(): string | null;
    convertToCardView: () => void;
    copy: () => void;
    download: () => void;
    refreshData: () => void;
    private _handleError;
    connectedCallback(): void;
    renderGfxBlock(): import("lit-html").TemplateResult<1>;
    accessor captionEditor: BlockCaptionEditor | null;
    accessor resizableImg: HTMLDivElement;
}
export declare const ImageEdgelessBlockInteraction: import("@linvo-core/composition").ExtensionType;
declare global {
    interface HTMLElementTagNameMap {
        'linvo-edgeless-image': ImageEdgelessBlockComponent;
    }
}
