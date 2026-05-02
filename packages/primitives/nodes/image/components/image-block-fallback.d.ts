import type { ResolvedStateInfo } from '@linvo-ui/components/resource';
import { ShadowlessElement } from '@linvo-core/std';
export declare const SURFACE_IMAGE_CARD_WIDTH = 220;
export declare const SURFACE_IMAGE_CARD_HEIGHT = 122;
export declare const NOTE_IMAGE_CARD_WIDTH = 752;
export declare const NOTE_IMAGE_CARD_HEIGHT = 78;
declare const ImageBlockFallbackCard_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class ImageBlockFallbackCard extends ImageBlockFallbackCard_base {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    accessor state: ResolvedStateInfo;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-image-fallback-card': ImageBlockFallbackCard;
    }
}
export {};
