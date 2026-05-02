import { type EmbedLoomBlockProps } from './loom-model';
export declare const EmbedLoomBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedLoomBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedLoomBlockProps>>) | undefined;
};
export declare const EmbedLoomBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
