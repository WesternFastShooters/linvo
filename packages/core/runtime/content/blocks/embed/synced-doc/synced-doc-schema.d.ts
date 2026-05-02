import { type EmbedSyncedDocBlockProps } from './synced-doc-model';
export declare const SYNCED_MIN_WIDTH = 370;
export declare const SYNCED_MIN_HEIGHT = 48;
export declare const SYNCED_DEFAULT_WIDTH = 800;
export declare const SYNCED_DEFAULT_MAX_HEIGHT = 800;
export declare const defaultEmbedSyncedDocBlockProps: EmbedSyncedDocBlockProps;
export declare const EmbedSyncedDocBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<import("../../..").EmbedProps<EmbedSyncedDocBlockProps>>;
        flavour: `linvo:embed-${string}`;
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<import("../../..").EmbedProps<EmbedSyncedDocBlockProps>>) | undefined;
};
export declare const EmbedSyncedDocBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
