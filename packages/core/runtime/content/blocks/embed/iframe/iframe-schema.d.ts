export declare const EmbedIframeBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("./iframe-model").EmbedIframeBlockProps>;
        flavour: "linvo:embed-iframe";
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("./iframe-model").EmbedIframeBlockProps>) | undefined;
};
export declare const EmbedIframeBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
