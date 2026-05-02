import { type EmbedGithubBlockProps } from './github-model';
export declare const EmbedGithubBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedGithubBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedGithubBlockProps>>) | undefined;
};
export declare const EmbedGithubBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
