import { type EmbedFigmaBlockProps } from './figma-model';
export declare const EmbedFigmaBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedFigmaBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedFigmaBlockProps>>) | undefined;
};
export declare const EmbedFigmaBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
