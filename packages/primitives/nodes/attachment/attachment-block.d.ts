import { CaptionedBlockComponent, SelectedStyle } from '@linvo-ui/components/caption';
import { type ResolvedStateInfo, ResourceController } from '@linvo-ui/components/resource';
import { type AttachmentBlockModel } from '@linvo-core/content';
import { type TemplateResult } from 'lit';
import { type ClassInfo } from 'lit/directives/class-map.js';
type AttachmentResolvedStateInfo = ResolvedStateInfo & {
    kind?: TemplateResult;
};
export declare class AttachmentBlockComponent extends CaptionedBlockComponent<AttachmentBlockModel> {
    static styles: import("lit").CSSResult;
    blockDraggable: boolean;
    resourceController: ResourceController;
    get blobUrl(): string | null;
    get filetype(): string;
    protected containerStyleMap: import("lit-html/directive.js").DirectiveResult<typeof import("lit-html/directives/style-map.js").StyleMapDirective>;
    private get _maxFileSize();
    get citationService(): import("@linvo-core/shared/services").CitationViewService;
    get isCitation(): boolean;
    get isCommentHighlighted(): boolean;
    convertTo: () => void;
    copy: () => void;
    download: () => void;
    embedded: () => boolean;
    open: () => void;
    refreshData: () => void;
    private readonly _refreshKey$;
    reload: () => void;
    replace: () => Promise<void>;
    private _selectBlock;
    private readonly _trackCitationDeleteEvent;
    connectedCallback(): void;
    firstUpdated(): void;
    protected onClick(event: MouseEvent): void;
    protected renderUpgradeButton: () => TemplateResult<1> | null | undefined;
    protected renderNormalButton: (needUpload: boolean) => TemplateResult<1>;
    protected renderWithHorizontal(classInfo: ClassInfo, { icon, title, description, kind, state, needUpload, }: AttachmentResolvedStateInfo): TemplateResult<1>;
    protected renderWithVertical(classInfo: ClassInfo, { icon, title, description, kind, state, needUpload, }: AttachmentResolvedStateInfo): TemplateResult<1>;
    protected resolvedState$: import("@preact/signals-core").ReadonlySignal<AttachmentResolvedStateInfo>;
    protected renderCardView: () => TemplateResult<1>;
    protected renderEmbedView: () => TemplateResult<1> | null;
    private readonly _renderCitation;
    renderBlock(): TemplateResult<1>;
    accessor selectedStyle: SelectedStyle;
    accessor useCaptionEditor: boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-attachment': AttachmentBlockComponent;
    }
}
export {};
