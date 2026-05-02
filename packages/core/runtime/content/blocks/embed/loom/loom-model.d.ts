export type EmbedLoomBlockUrlData = {
    videoId: string | null;
    image: string | null;
    title: string | null;
    description: string | null;
};
export declare const EmbedLoomStyles: ["video"];
export type EmbedLoomBlockProps = {
    style: (typeof EmbedLoomStyles)[number];
    url: string;
    caption: string | null;
} & EmbedLoomBlockUrlData;
declare const EmbedLoomModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<import("../../..").EmbedProps<EmbedLoomBlockProps>>;
};
export declare class EmbedLoomModel extends EmbedLoomModel_base {
}
export {};
