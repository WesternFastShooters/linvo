import type { EditorHost } from '@linvo-core/std';
import { ShadowlessElement } from '@linvo-core/std';
import type { BlockModel } from '@linvo-core/store';
declare const EmbedCardCreateModal_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EmbedCardCreateModal extends EmbedCardCreateModal_base {
    static styles: import("lit").CSSResult;
    private readonly _onCancel;
    private readonly _onConfirm;
    private readonly _onDocumentKeydown;
    private _handleInput;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    private accessor _linkInputValue;
    accessor createOptions: {
        mode: 'page';
        parentModel: BlockModel | string;
        index?: number;
    } | {
        mode: 'edgeless';
        onSave: (url: string) => void;
    };
    accessor descriptionText: string;
    accessor host: EditorHost;
    accessor input: HTMLInputElement;
    accessor onConfirm: (options: {
        mode: 'edgeless' | 'page';
    }) => void;
    accessor titleText: string;
}
export declare function toggleEmbedCardCreateModal(host: EditorHost, titleText: string, descriptionText: string, createOptions: {
    mode: 'page';
    parentModel: BlockModel | string;
    index?: number;
} | {
    mode: 'edgeless';
    onSave: (url: string) => void;
}, onConfirm: (options: {
    mode: 'page' | 'edgeless';
}) => void): Promise<void>;
declare global {
    interface HTMLElementTagNameMap {
        'embed-card-create-modal': EmbedCardCreateModal;
    }
}
export {};
