import { SurfaceBlockModel } from '@linvo-core/block-surface';
import {
  CaptionedBlockComponent,
  SelectedStyle,
} from '@linvo-ui/components/caption';
import { createLitPortal } from '@linvo-ui/components/portal';
import type { EmbedIframeBlockModel } from '@linvo-core/content';
import {
  type EmbedIframeData,
  EmbedIframeService,
  type IframeOptions,
  LinkPreviewServiceIdentifier,
  NotificationProvider,
} from '@linvo-core/shared/services';
import { matchModels } from '@linvo-core/shared/utils';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { BlockSelection } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
import { flip, offset, shift } from '@floating-ui/dom';
import {
  computed,
  effect,
  type ReadonlySignal,
  signal,
} from '@preact/signals-core';
import { html } from 'lit';
import { query } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { EmbedLinkInputPopupOptions } from './components/embed-iframe-link-input-popup';
import {
  DEFAULT_IFRAME_HEIGHT,
  DEFAULT_IFRAME_WIDTH,
  EMBED_IFRAME_DEFAULT_CONTAINER_BORDER_RADIUS,
  ERROR_CARD_DEFAULT_HEIGHT,
  IDLE_CARD_DEFAULT_HEIGHT,
  LINK_CREATE_POPUP_OFFSET,
  LOADING_CARD_DEFAULT_HEIGHT,
} from './consts';
import {
  getSurfaceWebPreviewLeaseVersion,
} from './surface-web-preview-state';
import { embedIframeBlockStyles } from './style';
import type { EmbedIframeStatusCardOptions } from './types';
import { safeGetIframeSrc } from './utils';

export type EmbedIframeStatus = 'idle' | 'loading' | 'success' | 'error';

export class EmbedIframeBlockComponent extends CaptionedBlockComponent<EmbedIframeBlockModel> {
  selectedStyle$: ReadonlySignal<ClassInfo> | null = computed<ClassInfo>(
    () => ({
      'selected-style': this.selected$.value,
    })
  );

  blockDraggable = true;

  static override styles = embedIframeBlockStyles;

  readonly status$ = signal<EmbedIframeStatus>('idle');
  readonly error$ = signal<Error | null>(null);

  readonly isIdle$ = computed(() => this.status$.value === 'idle');
  readonly isLoading$ = computed(() => this.status$.value === 'loading');
  readonly hasError$ = computed(() => this.status$.value === 'error');
  readonly isSuccess$ = computed(() => this.status$.value === 'success');

  readonly isDraggingOnHost$ = signal(false);
  readonly isResizing$ = signal(false);
  readonly isZoomingOnCanvas$ = signal(false);
  readonly hasSurfacePreviewLease$ = signal(false);
  // show overlay to prevent the iframe from capturing pointer events
  // when the block is dragging, resizing, or not selected
  readonly showOverlay$ = computed(
    () =>
      this.isSuccess$.value &&
      (this.isDraggingOnHost$.value ||
        this.isResizing$.value ||
        !this.selected$.value)
  );

  readonly shouldPauseSurfacePreview$ = computed(() => {
    if (!this.inSurface || !this.iframeOptions?.protectSurfacePerformance) {
      return false;
    }

    return (
      this.isDraggingOnHost$.value ||
      this.isResizing$.value ||
      this.isZoomingOnCanvas$.value
    );
  });

  readonly surfacePreviewReason$ = computed(() => {
    if (this.isZoomingOnCanvas$.value) {
      return 'Zooming';
    }
    if (this.isDraggingOnHost$.value || this.isResizing$.value) {
      return 'Editing';
    }
    return 'Protected';
  });

  readonly shouldRenderLiveIframe$ = computed(() => {
    if (!this.isSuccess$.value) {
      return false;
    }

    if (!this.inSurface || !this.iframeOptions?.protectSurfacePerformance) {
      return true;
    }

    return !this.shouldPauseSurfacePreview$.value;
  });

  // since different providers have different border radius
  // we need to update the selected border radius when the iframe is loaded
  readonly selectedBorderRadius$ = computed(() => {
    if (
      this.status$.value === 'success' &&
      typeof this.iframeOptions?.containerBorderRadius === 'number'
    ) {
      return this.iframeOptions.containerBorderRadius;
    }
    return EMBED_IFRAME_DEFAULT_CONTAINER_BORDER_RADIUS;
  });

  protected iframeOptions: IframeOptions | undefined = undefined;

  get embedIframeService() {
    return this.std.get(EmbedIframeService);
  }

  get linkPreviewService() {
    return this.std.get(LinkPreviewServiceIdentifier);
  }

  get notificationService() {
    return this.std.getOptional(NotificationProvider);
  }

  get inSurface() {
    return matchModels(this.model.parent, [SurfaceBlockModel]);
  }

  private get _surfaceTransformState() {
    if (!('transformState$' in this)) {
      return 'active';
    }

    return (
      this as typeof this & {
        transformState$: ReadonlySignal<'idle' | 'active'>;
      }
    ).transformState$.value;
  }

  get _horizontalCardHeight(): number {
    switch (this.status$.value) {
      case 'idle':
        return IDLE_CARD_DEFAULT_HEIGHT;
      case 'loading':
        return LOADING_CARD_DEFAULT_HEIGHT;
      case 'error':
        return ERROR_CARD_DEFAULT_HEIGHT;
      default:
        return LOADING_CARD_DEFAULT_HEIGHT;
    }
  }

  get _statusCardOptions(): EmbedIframeStatusCardOptions {
    return this.inSurface
      ? { layout: 'vertical' }
      : { layout: 'horizontal', height: this._horizontalCardHeight };
  }

  open = () => {
    const link = this.model.props.url;
    if (!link) {
      this.notificationService?.notify({
        title: 'No link found',
        message: 'Please set a link to the block',
        accent: 'warning',
        onClose: function (): void {},
      });
      return;
    }
    window.open(link, '_blank');
  };

  refreshData = async () => {
    const { url, iframeUrl } = this.model.props;
    const preserveRenderedState =
      Boolean(iframeUrl) &&
      iframeUrl === url &&
      this.status$.value === 'success';

    try {
      if (!url) {
        this.status$.value = 'idle';
        return false;
      }

      // set loading status
      this.error$.value = null;
      if (!preserveRenderedState) {
        this.status$.value = 'loading';
      }

      // get embed data
      const embedIframeService = this.embedIframeService;
      const linkPreviewService = this.linkPreviewService;
      if (!embedIframeService || !linkPreviewService) {
        throw new LinvoError(
          ErrorCode.ValueNotExists,
          'EmbedIframeService or LinkPreviewService not found'
        );
      }

      // get embed data and preview data in a promise
      const [embedData, previewData] = await Promise.all([
        embedIframeService.getEmbedIframeData(url),
        linkPreviewService.query(url),
      ]);

      // if the embed data is not found, and the iframeUrl is not set, throw an error
      const currentIframeUrl = this.model.props.iframeUrl;
      if (!embedData && !currentIframeUrl) {
        throw new LinvoError(
          ErrorCode.ValueNotExists,
          'Failed to get embed data'
        );
      }

      // update model
      const iframeUrl = this._getIframeUrl(embedData) ?? currentIframeUrl;
      this.store.updateBlock(this.model, {
        iframeUrl,
        title: embedData?.title || previewData?.title,
        description: embedData?.description || previewData?.description,
      });

      // update iframe options, to ensure the iframe is rendered with the correct options
      this._updateIframeOptions(url);

      // set success status
      this.status$.value = 'success';
      return true;
    } catch (err) {
      if (preserveRenderedState) {
        return false;
      }

      // set error status
      this.status$.value = 'error';
      this.error$.value = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to refresh iframe data:', err);
      return false;
    }
  };

  private _linkInputAbortController: AbortController | null = null;
  toggleLinkInputPopup = (options?: EmbedLinkInputPopupOptions) => {
    if (this.readonly) {
      return;
    }

    // toggle create popup when ths block is in idle status and the url is not set
    if (!this._blockContainer || !this.isIdle$.value || this.model.props.url) {
      return;
    }

    if (this._linkInputAbortController) {
      this._linkInputAbortController.abort();
    }

    this._linkInputAbortController = new AbortController();

    createLitPortal({
      template: html`<embed-iframe-link-input-popup
        .model=${this.model}
        .abortController=${this._linkInputAbortController}
        .std=${this.std}
        .inSurface=${this.inSurface}
        .options=${options}
      ></embed-iframe-link-input-popup>`,
      container: document.body,
      computePosition: {
        referenceElement: this._blockContainer,
        placement: 'bottom',
        middleware: [flip(), offset(LINK_CREATE_POPUP_OFFSET), shift()],
        autoUpdate: { animationFrame: true },
      },
      abortController: this._linkInputAbortController,
      closeOnClickAway: true,
    });
  };

  /**
   * Get the iframe url from the embed data, first check if iframe_url is set,
   * if not, check if html is set and get the iframe src from html
   * @param embedData - The embed data
   * @returns The iframe url
   */
  private readonly _getIframeUrl = (embedData: EmbedIframeData | null) => {
    const { iframe_url, html } = embedData ?? {};
    return iframe_url ?? (html && safeGetIframeSrc(html));
  };

  private readonly _updateIframeOptions = (url: string) => {
    const config = this.embedIframeService?.getConfig(url);
    if (config) {
      this.iframeOptions = config.options;
    }
  };

  private readonly _handleDoubleClick = () => {
    this.open();
  };

  private readonly _selectBlock = () => {
    const { selectionManager } = this;
    const blockSelection = selectionManager.create(BlockSelection, {
      blockId: this.blockId,
    });
    selectionManager.setGroup('note', [blockSelection]);
  };

  protected _handleClick = () => {
    // when the block is in idle status and the url is not set, clear the selection
    // and show the link input popup
    if (this.isIdle$.value && !this.model.props.url) {
      // when the block is in the surface, clear the surface selection
      // otherwise, clear the block selection
      this.selectionManager.clear([this.inSurface ? 'surface' : 'block']);
      this.toggleLinkInputPopup();
      return;
    }

    // We don't need to select the block when the block is in the surface
    if (this.inSurface) {
      return;
    }

    // otherwise, select the block
    this._selectBlock();
  };

  private readonly _handleRetry = async () => {
    return await this.refreshData();
  };

  private readonly _renderIframe = () => {
    const { iframeUrl } = this.model.props;
    const {
      widthPercent,
      heightInNote,
      style,
      sandbox,
      allow,
      referrerpolicy,
      scrolling,
      allowFullscreen,
    } = this.iframeOptions ?? {};
    const width = `${widthPercent}%`;
    // if the block is in the surface, use 100% as the height
    // otherwise, use the heightInNote
    const height = this.inSurface ? '100%' : heightInNote;
    return html`
      <iframe
        width=${width ?? DEFAULT_IFRAME_WIDTH}
        height=${height ?? DEFAULT_IFRAME_HEIGHT}
        ?allowfullscreen=${allowFullscreen}
        loading="lazy"
        frameborder="0"
        credentialless
        src=${ifDefined(iframeUrl)}
        sandbox=${ifDefined(sandbox)}
        allow=${ifDefined(allow)}
        referrerpolicy=${ifDefined(referrerpolicy)}
        scrolling=${ifDefined(scrolling)}
        style=${ifDefined(style)}
      ></iframe>
    `;
  };

  private readonly _renderContent = () => {
    if (this.isIdle$.value) {
      return html`<embed-iframe-idle-card
        .options=${this._statusCardOptions}
      ></embed-iframe-idle-card>`;
    }

    if (this.isLoading$.value) {
      return html`<embed-iframe-loading-card
        .std=${this.std}
        .options=${this._statusCardOptions}
      ></embed-iframe-loading-card>`;
    }

    if (this.hasError$.value) {
      return html`<embed-iframe-error-card
        .error=${this.error$.value}
        .model=${this.model}
        .onRetry=${this._handleRetry}
        .std=${this.std}
        .inSurface=${this.inSurface}
        .options=${this._statusCardOptions}
      ></embed-iframe-error-card>`;
    }

    if (!this.shouldRenderLiveIframe$.value) {
      return html`<embed-iframe-suspended-card
        .description=${this.model.props.description ?? ''}
        .reason=${this.surfacePreviewReason$.value}
        .title=${this.model.props.title ?? ''}
        .url=${this.model.props.url}
      ></embed-iframe-suspended-card>`;
    }

    return this._renderIframe();
  };

  override connectedCallback() {
    super.connectedCallback();

    this.contentEditable = 'false';

    // update the selected style when the block is in the note
    this.disposables.add(
      effect(() => {
        if (this.inSurface) {
          return;
        }

        // when the block is in idle status, use the background style
        // otherwise, use the border style
        if (this.status$.value === 'idle') {
          this.selectedStyle = SelectedStyle.Background;
        } else {
          this.selectedStyle = SelectedStyle.Border;
        }
      })
    );

    // if the iframe url is not set, refresh the data to get the iframe url
    if (!this.model.props.iframeUrl) {
      this.store.withoutTransact(() => {
        this.refreshData().catch(console.error);
      });
    } else {
      // update iframe options, to ensure the iframe is rendered with the correct options
      this._updateIframeOptions(this.model.props.url);
      this.status$.value = 'success';
      if (!this.model.props.title || !this.model.props.description) {
        this.store.withoutTransact(() => {
          this.refreshData().catch(console.error);
        });
      }
    }

    // refresh data when original url changes
    this.disposables.add(
      this.model.propsUpdated.subscribe(({ key }) => {
        if (key === 'url') {
          this.refreshData().catch(console.error);
        }
      })
    );

    const gfx = this.inSurface
      ? this.std.getOptional(GfxControllerIdentifier)
      : null;
    if (gfx) {
      this.disposables.add(
        gfx.viewport.zooming$.subscribe(isZooming => {
          this.isZoomingOnCanvas$.value = isZooming;
        })
      );
    }

    this.disposables.add(
      effect(() => {
        const leaseVersion = getSurfaceWebPreviewLeaseVersion();
        void leaseVersion;
        this.hasSurfacePreviewLease$.value =
          this.inSurface &&
          this.isSuccess$.value &&
          !this.shouldPauseSurfacePreview$.value;
      })
    );

    // subscribe the editor host global dragging event
    // to show the overlay for the dragging area or other pointer events
    this.handleEvent(
      'dragStart',
      () => {
        this.isDraggingOnHost$.value = true;
      },
      { global: true }
    );
    this.handleEvent(
      'dragEnd',
      () => {
        this.isDraggingOnHost$.value = false;
      },
      { global: true }
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._linkInputAbortController?.abort();
    this._linkInputAbortController = null;
    this.hasSurfacePreviewLease$.value = false;
  }

  override renderBlock() {
    const containerClasses = classMap({
      'linvo-embed-iframe-block-container': true,
      ...this.selectedStyle$?.value,
      'in-surface': this.inSurface,
    });
    const containerStyles = styleMap({
      borderRadius: `${this.selectedBorderRadius$.value}px`,
    });

    const overlayClasses = classMap({
      'linvo-embed-iframe-block-overlay': true,
      show: this.showOverlay$.value,
    });

    return html`
      <div
        draggable=${this.blockDraggable ? 'true' : 'false'}
        class=${containerClasses}
        style=${containerStyles}
        @click=${this._handleClick}
        @dblclick=${this._handleDoubleClick}
      >
        ${this._renderContent()}

        <!-- overlay to prevent the iframe from capturing pointer events -->
        <div class=${overlayClasses}></div>
      </div>
    `;
  }

  override accessor blockContainerStyles = {
    margin: '18px 0',
    backgroundColor: 'transparent',
  };

  get readonly() {
    return this.store.readonly;
  }

  get selectionManager() {
    return this.host.selection;
  }

  override accessor useCaptionEditor = true;

  override accessor useZeroWidth = true;

  override accessor selectedStyle = SelectedStyle.Border;

  @query('.linvo-embed-iframe-block-container')
  accessor _blockContainer: HTMLElement | null = null;
}
