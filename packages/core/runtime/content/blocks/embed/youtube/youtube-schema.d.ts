import { type EmbedYoutubeBlockProps } from './youtube-model';
export declare const EmbedYoutubeBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedYoutubeBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedYoutubeBlockProps>>) | undefined;
};
export declare const EmbedYoutubeBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
