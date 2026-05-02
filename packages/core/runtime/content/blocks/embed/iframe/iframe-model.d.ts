import { type GfxCommonBlockProps, type GfxElementGeometry } from '@linvo-core/std/gfx';
export declare const EmbedIframeStyles: ["figma"];
export type EmbedIframeBlockProps = {
    url: string;
    iframeUrl?: string;
    width?: number;
    height?: number;
    caption: string | null;
    title: string | null;
    description: string | null;
} & Omit<GfxCommonBlockProps, 'rotate'>;
export declare const defaultEmbedIframeProps: EmbedIframeBlockProps;
declare const EmbedIframeBlockModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<EmbedIframeBlockProps>;
};
export declare class EmbedIframeBlockModel extends EmbedIframeBlockModel_base implements GfxElementGeometry {
}
export {};
