export declare const EmbedHtmlStyles: ["html"];
export type EmbedHtmlBlockProps = {
    style: (typeof EmbedHtmlStyles)[number];
    caption: string | null;
    html?: string;
    design?: string;
};
declare const EmbedHtmlModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<import("../../..").EmbedProps<EmbedHtmlBlockProps>>;
};
export declare class EmbedHtmlModel extends EmbedHtmlModel_base {
}
export {};
