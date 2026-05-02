import type { Text } from '@linvo-core/store';
import { BlockModel } from '@linvo-core/store';
export type RootBlockProps = {
    title: Text;
};
export declare class RootBlockModel extends BlockModel<RootBlockProps> {
    constructor();
    /**
     * A page is empty if it only contains one empty note and the canvas is empty
     */
    isEmpty(): boolean;
}
export declare const RootBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<RootBlockProps>;
        flavour: "linvo:root";
    } & {
        version: number;
        role: "root";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<RootBlockProps>) | undefined;
};
export declare const RootBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
