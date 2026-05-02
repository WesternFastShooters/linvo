export type EmbedYoutubeBlockUrlData = {
    videoId: string | null;
    image: string | null;
    title: string | null;
    description: string | null;
    creator: string | null;
    creatorUrl: string | null;
    creatorImage: string | null;
};
export declare const EmbedYoutubeStyles: ["video"];
export type EmbedYoutubeBlockProps = {
    style: (typeof EmbedYoutubeStyles)[number];
    url: string;
    caption: string | null;
} & EmbedYoutubeBlockUrlData;
declare const EmbedYoutubeModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<import("../../..").EmbedProps<EmbedYoutubeBlockProps>>;
};
export declare class EmbedYoutubeModel extends EmbedYoutubeModel_base {
}
export {};
