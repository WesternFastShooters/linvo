import { type AttachmentBlockModel } from '@linvo-core/content';
import type { Container } from '@linvo-core/composition/di';
import { type BlockStdScope } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
import { Extension } from '@linvo-core/store';
import type { TemplateResult } from 'lit';
export type AttachmentEmbedConfig = {
    name: string;
    /**
     * Check if the attachment can be turned into embed view.
     */
    check: (model: AttachmentBlockModel, maxFileSize: number) => boolean;
    /**
     * The action will be executed when the 「Turn into embed view」 button is clicked.
     */
    action?: (model: AttachmentBlockModel, std: BlockStdScope) => Promise<void> | void;
    /**
     * Renders the embed view.
     */
    render?: (model: AttachmentBlockModel, blobUrl: string) => TemplateResult | null;
    /**
     * Should show status when turned on.
     */
    shouldShowStatus?: boolean;
    /**
     * Should block type conversion be required.
     */
    shouldBeConverted?: boolean;
};
export declare const AttachmentEmbedConfigIdentifier: import("@linvo-core/composition/di").ServiceIdentifier<AttachmentEmbedConfig> & (<U extends AttachmentEmbedConfig = AttachmentEmbedConfig>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare function AttachmentEmbedConfigExtension(configs?: AttachmentEmbedConfig[]): ExtensionType;
export declare const AttachmentEmbedConfigMapIdentifier: import("@linvo-core/composition/di").ServiceIdentifier<Map<string, AttachmentEmbedConfig>> & (<U extends Map<string, AttachmentEmbedConfig> = Map<string, AttachmentEmbedConfig>>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare const AttachmentEmbedProvider: import("@linvo-core/composition/di").ServiceIdentifier<AttachmentEmbedService> & (<U extends AttachmentEmbedService = AttachmentEmbedService>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare class AttachmentEmbedService extends Extension {
    private readonly std;
    private get _maxFileSize();
    get keys(): MapIterator<string>;
    get values(): MapIterator<AttachmentEmbedConfig>;
    get configs(): Map<string, AttachmentEmbedConfig>;
    constructor(std: BlockStdScope);
    static setup(di: Container): void;
    convertTo(model: AttachmentBlockModel, maxFileSize?: number): void;
    embedded(model: AttachmentBlockModel, maxFileSize?: number): boolean;
    getRender(model: AttachmentBlockModel, maxFileSize?: number): ((model: AttachmentBlockModel, blobUrl: string) => TemplateResult | null) | null;
    shouldShowStatus(model: AttachmentBlockModel, maxFileSize?: number): boolean;
    shouldBeConverted(model: AttachmentBlockModel, maxFileSize?: number): boolean;
}
