import { type EmbedHtmlBlockProps } from './html-model';
export declare const EmbedHtmlBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedHtmlBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedHtmlBlockProps>>) | undefined;
};
export declare const EmbedHtmlBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
