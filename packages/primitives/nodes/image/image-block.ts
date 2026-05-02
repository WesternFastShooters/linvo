import { CaptionedBlockComponent } from '@linvo-ui/components/caption';
import { whenHover } from '@linvo-ui/components/hover';
import { LoadingIcon } from '@linvo-ui/components/icons';
import { Peekable } from '@linvo-ui/components/peek';
import { ResourceController } from '@linvo-ui/components/resource';
import type { ImageBlockModel } from '@linvo-core/content';
import { ImageSelection } from '@linvo-core/shared/selection';
import {
  BlockCommentManager,
  ToolbarRegistryIdentifier,
} from '@linvo-core/shared/services';
import { formatSize } from '@linvo-core/shared/utils';
import { IS_MOBILE } from '@linvo-core/global/env';
import { BrokenImageIcon, ImageIcon } from '@icons/lit';
import { BlockSelection } from '@linvo-core/std';
import { computed } from '@preact/signals-core';
import { cssVarV2 } from '@theme/v2';
import { html } from 'lit';
import { query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import {
  copyImageBlob,
  downloadImageBlob,
  refreshData,
  turnImageIntoCardView,
} from './utils';

type ImageBlockPageLike = HTMLElement & {
  resizeImg?: HTMLElement | null;
};

@Peekable({
  enableOn: () => !IS_MOBILE,
})
export class ImageBlockComponent extends CaptionedBlockComponent<ImageBlockModel> {
  resizeable$ = computed(() =>
    this.std.selection.value.some(
      selection =>
        selection.is(ImageSelection) && selection.blockId === this.blockId
    )
  );

  resourceController = new ResourceController(
    computed(() => this.model.props.sourceId$.value),
    'Image'
  );

  get blobUrl() {
    return this.resourceController.blobUrl$.value;
  }

  convertToCardView = () => {
    turnImageIntoCardView(this).catch(console.error);
  };

  copy = () => {
    copyImageBlob(this).catch(console.error);
  };

  download = () => {
    downloadImageBlob(this).catch(console.error);
  };

  refreshData = () => {
    refreshData(this).catch(console.error);
  };

  get resizableImg() {
    return this.pageImage?.resizeImg;
  }

  get isCommentHighlighted() {
    return (
      this.std
        .getOptional(BlockCommentManager)
        ?.isBlockCommentHighlighted(this.model) ?? false
    );
  }

  private _handleClick(event: MouseEvent) {
    // the peek view need handle shift + click
    if (event.defaultPrevented) return;

    event.stopPropagation();
    const selectionManager = this.host.selection;
    const blockSelection = selectionManager.create(BlockSelection, {
      blockId: this.blockId,
    });
    selectionManager.setGroup('note', [blockSelection]);
  }

  private _initHover() {
    const { setReference, setFloating, dispose } = whenHover(
      hovered => {
        const message$ = this.std.get(ToolbarRegistryIdentifier).message$;
        if (hovered) {
          message$.value = {
            flavour: this.model.flavour,
            element: this,
            setFloating,
          };
          return;
        }

        // Clears previous bindings
        message$.value = null;
        setFloating();
      },
      { enterDelay: 500 }
    );
    setReference(this.hoverableContainer);
    this._disposables.add(dispose);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.contentEditable = 'false';

    this.resourceController.setEngine(this.std.store.blobSync);

    this.disposables.add(this.resourceController.subscribe());
    this.disposables.add(this.resourceController);

    this.disposables.add(
      this.model.props.sourceId$.subscribe(() => {
        this.refreshData();
      })
    );
  }

  override firstUpdated() {
    // lazy bindings
    this.disposables.addFromEvent(this, 'click', this._handleClick);
    this._initHover();
  }

  override renderBlock() {
    const blobUrl = this.blobUrl;
    const { size = 0 } = this.model.props;

    const containerStyleMap = styleMap({
      position: 'relative',
      width: '100%',
    });

    const resovledState = this.resourceController.resolveStateWith({
      loadingIcon: LoadingIcon({
        strokeColor: cssVarV2('button/pureWhiteText'),
        ringColor: cssVarV2('loading/imageLoadingLayer', '#ffffff8f'),
      }),
      errorIcon: BrokenImageIcon(),
      icon: ImageIcon(),
      title: 'Image',
      description: formatSize(size),
    });

    return html`
      <div class="linvo-image-container" style=${containerStyleMap}>
        ${when(
          blobUrl,
          () =>
            html`<linvo-page-image
              .block=${this}
              .state=${resovledState}
            ></linvo-page-image>`,
          () =>
            html`<linvo-image-fallback-card
              .state=${resovledState}
            ></linvo-image-fallback-card>`
        )}
      </div>

      ${Object.values(this.widgets)}
    `;
  }

  override accessor blockContainerStyles = { margin: '18px 0' };

  @query('linvo-page-image')
  private accessor pageImage: ImageBlockPageLike | null = null;

  @query('.linvo-image-container')
  accessor hoverableContainer!: HTMLDivElement;

  override accessor useCaptionEditor = true;

  override accessor useZeroWidth = true;
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-image': ImageBlockComponent;
  }
}
