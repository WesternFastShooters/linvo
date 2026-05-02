import { ThemeProvider } from '@linvo-core/shared/services';
import { BlockComponent } from '@linvo-core/std';
import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './styles';
export var SelectedStyle;
(function (SelectedStyle) {
    SelectedStyle["Background"] = "Background";
    SelectedStyle["Border"] = "Border";
})(SelectedStyle || (SelectedStyle = {}));
export class CaptionedBlockComponent extends BlockComponent {
    static { this.styles = styles; }
    get captionEditor() {
        if (!this.useCaptionEditor || !this._captionEditorRef.value) {
            console.error('Oops! Please enable useCaptionEditor before accessing captionEditor');
        }
        return this._captionEditorRef.value;
    }
    constructor() {
        super();
        this.addRenderer(this._renderWithWidget);
    }
    _renderWithWidget(content) {
        const style = styleMap({
            position: 'relative',
            ...this.blockContainerStyles,
        });
        const theme = this.std.get(ThemeProvider).theme;
        const isBorder = this.selectedStyle === SelectedStyle.Border;
        return html `<div
      style=${style}
      class=${classMap({
            'linvo-block-component': true,
            [theme]: true,
            border: isBorder,
        })}
    >
      ${content}
      ${this.useCaptionEditor
            ? html `<block-caption-editor
            ${ref(this._captionEditorRef)}
          ></block-caption-editor>`
            : nothing}
      ${this.selectedStyle === SelectedStyle.Background
            ? html `<linvo-block-selection
            .selected=${this.selected$.value}
          ></linvo-block-selection>`
            : null}
      ${this.useZeroWidth && !this.store.readonly
            ? html `<block-zero-width .block=${this}></block-zero-width>`
            : nothing}
    </div>`;
    }
    // There may be multiple block-caption-editors in a nested structure.
    accessor _captionEditorRef = createRef();
    accessor blockContainerStyles = undefined;
    accessor selectedStyle = SelectedStyle.Background;
    accessor useCaptionEditor = false;
    accessor useZeroWidth = false;
}
