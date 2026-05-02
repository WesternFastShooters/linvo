import { LoadingIcon, OpenIcon } from '@linvo-ui/components/icons';
import type {
  EmbedYoutubeModel,
  EmbedYoutubeStyles,
} from '@linvo-core/content';
import { ImageProxyService } from '@linvo-core/shared/adapters';
import { ThemeProvider } from '@linvo-core/shared/services';
import { BlockSelection } from '@linvo-core/std';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { EmbedBlockComponent } from '../embed-shared/embed-block-element';
import { getEmbedCardIcons } from '../embed-shared/utils';
import { youtubeUrlRegex } from './embed-youtube-model';
import type { EmbedYoutubeBlockService } from './embed-youtube-service';
import { styles, YoutubeIcon } from './styles';
import { refreshEmbedYoutubeUrlData } from './utils';

export class EmbedYoutubeBlockComponent extends EmbedBlockComponent<
  EmbedYoutubeModel,
  EmbedYoutubeBlockService
> {
  static override styles = styles;

  override _cardStyle: (typeof EmbedYoutubeStyles)[number] = 'video';

  open = () => {
    let link = this.model.props.url;
    if (!link.match(/^[a-zA-Z]+:\/\//)) {
      link = 'https://' + link;
    }
    window.open(link, '_blank');
  };

  refreshData = () => {
    refreshEmbedYoutubeUrlData(this, this.fetchAbortController.signal).catch(
      console.error
    );
  };

  private _handleDoubleClick(event: MouseEvent) {
    event.stopPropagation();
    this.open();
  }

  private _selectBlock() {
    const selectionManager = this.host.selection;
    const blockSelection = selectionManager.create(BlockSelection, {
      blockId: this.blockId,
    });
    selectionManager.setGroup('note', [blockSelection]);
  }

  protected _handleClick(event: MouseEvent) {
    event.stopPropagation();
    this._selectBlock();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._cardStyle = this.model.props.style;

    if (!this.model.props.videoId) {
      this.store.withoutTransact(() => {
        const url = this.model.props.url;
        const urlMatch = url.match(youtubeUrlRegex);
        if (urlMatch) {
          const [, videoId] = urlMatch;
          this.store.updateBlock(this.model, {
            videoId,
          });
        }
      });
    }

    if (!this.model.props.description && !this.model.props.title) {
      this.store.withoutTransact(() => {
        this.refreshData();
      });
    }

    this.disposables.add(
      this.model.propsUpdated.subscribe(({ key }) => {
        this.requestUpdate();
        if (key === 'url') {
          this.refreshData();
        }
      })
    );

    matchMedia('print').addEventListener('change', () => {
      this._showImage = matchMedia('print').matches;
    });
  }

  override renderBlock() {
    const {
      image,
      title = 'YouTube',
      description,
      creator,
      creatorImage,
      videoId,
    } = this.model.props;

    const loading = this.loading;
    const theme = this.std.get(ThemeProvider).theme;
    const imageProxyService = this.store.get(ImageProxyService);
    const { EmbedCardBannerIcon } = getEmbedCardIcons(theme);
    const titleIcon = loading ? LoadingIcon() : YoutubeIcon;
    const titleText = loading ? 'Loading...' : title;
    const descriptionText = loading ? null : description;
    const bannerImage =
      !loading && image
        ? html`<img src=${imageProxyService.buildUrl(image)} alt="banner" />`
        : EmbedCardBannerIcon;

    const creatorImageEl =
      !loading && creatorImage
        ? html`<img
            src=${imageProxyService.buildUrl(creatorImage)}
            alt="creator"
          />`
        : nothing;

    return this.renderEmbed(
      () => html`
        <div
          class=${classMap({
            'linvo-embed-youtube-block': true,
            loading,
            selected: this.selected$.value,
          })}
          style=${styleMap({
            transformOrigin: '0 0',
          })}
          @click=${this._handleClick}
          @dblclick=${this._handleDoubleClick}
        >
          <div class="linvo-embed-youtube-video">
            ${videoId
              ? html`
                  <div class="linvo-embed-youtube-video-iframe-container">
                    <iframe
                      id="ytplayer"
                      type="text/html"
                      src=${`https://www.youtube.com/embed/${videoId}`}
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                      loading="lazy"
                      credentialless
                    ></iframe>

                    <!-- overlay to prevent the iframe from capturing pointer events -->
                    <div
                      class=${classMap({
                        'linvo-embed-youtube-video-iframe-overlay': true,
                        hide: !this.showOverlay$.value,
                      })}
                    ></div>
                    <img
                      class=${classMap({
                        'linvo-embed-youtube-video-iframe-overlay': true,
                        'media-print': true,
                        hide: !this._showImage,
                      })}
                      src=${`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="YouTube Video"
                      loading="lazy"
                    />
                  </div>
                `
              : bannerImage}
          </div>
          <div class="linvo-embed-youtube-content">
            <div class="linvo-embed-youtube-content-header">
              <div class="linvo-embed-youtube-content-title-icon">
                ${titleIcon}
              </div>

              <div class="linvo-embed-youtube-content-title-text">
                ${titleText}
              </div>

              <div class="linvo-embed-youtube-content-creator-image">
                ${creatorImageEl}
              </div>

              <div class="linvo-embed-youtube-content-creator-text">
                ${creator}
              </div>
            </div>

            ${loading
              ? html`<div
                  class="linvo-embed-youtube-content-description"
                ></div>`
              : descriptionText
                ? html`<div class="linvo-embed-youtube-content-description">
                    ${descriptionText}
                  </div>`
                : nothing}

            <div class="linvo-embed-youtube-content-url" @click=${this.open}>
              <span>www.youtube.com</span>

              <div class="linvo-embed-youtube-content-url-icon">
                ${OpenIcon}
              </div>
            </div>
          </div>
        </div>
      `
    );
  }

  @state()
  private accessor _showImage = false;

  @property({ attribute: false })
  accessor loading = false;
}
