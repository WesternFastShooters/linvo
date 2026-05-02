import { addAttachments } from '@linvo-primitives/attachment';
import {
  EMBED_IFRAME_DEFAULT_HEIGHT_IN_SURFACE,
  EMBED_IFRAME_DEFAULT_WIDTH_IN_SURFACE,
} from '@linvo-primitives/embed/whiteboard-utils';
import { EdgelessFrameManagerIdentifier } from '@linvo-primitives/frame';
import { addImages } from '@linvo-primitives/image/utils';
import {
  CanvasRenderer,
  CanvasElementType,
  DefaultTool,
  EdgelessCRUDIdentifier,
  ExportManager,
  getSurfaceComponent,
} from '@linvo-core/block-surface';
import { splitIntoLines } from '@linvo-primitives/text';
import type {
  EmbedCardStyle,
  ShapeElementModel,
} from '@linvo-core/content';
import {
  FrameBlockModel,
  MAX_IMAGE_WIDTH,
} from '@linvo-core/content';
import {
  ClipboardAdapter,
  decodeClipboardBlobs,
  pasteMiddleware,
  replaceIdMiddleware,
  surfaceRefToEmbed,
  uploadMiddleware,
} from '@linvo-core/shared/adapters';
import {
  CANVAS_EXPORT_IGNORE_TAGS,
  EMBED_CARD_HEIGHT,
  EMBED_CARD_WIDTH,
} from '@linvo-core/shared/consts';
import {
  EmbedOptionProvider,
  EmbedIframeService,
  TelemetryProvider,
} from '@linvo-core/shared/services';
import {
  convertToPng,
  isInsidePageEditor,
  isTopLevelBlock,
  isUrlInClipboard,
  matchModels,
} from '@linvo-core/shared/utils';
import { DisposableGroup } from '@linvo-core/global/disposable';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import {
  Bound,
  getCommonBound,
  type IBound,
  type IVec,
  Vec,
} from '@linvo-core/global/gfx';
import type {
  EditorHost,
  SurfaceSelection,
  UIEventStateContext,
} from '@linvo-core/std';
import {
  compareLayer,
  type GfxBlockElementModel,
  GfxControllerIdentifier,
  type GfxPrimitiveElementModel,
  type SerializedElement,
} from '@linvo-core/std/gfx';
import { type BlockSnapshot, type SliceSnapshot } from '@linvo-core/store';
import { PlainText } from '@linvo-core/store/reactive/text';

import { ReadOnlyClipboard } from '../../clipboard/readonly-clipboard';
import { getSortedCloneElements } from '../utils/clone-utils';
import { isCanvasElementWithText, isImageBlock } from '../utils/query';
import { createElementsFromClipboardDataCommand } from './command';
import {
  isPureFileInClipboard,
  prepareClipboardData,
  tryGetSvgFromClipboard,
} from './utils';

const BLOCKSUITE_SURFACE = 'linvo/surface';

const IMAGE_PADDING = 5; // for rotated shapes some padding is needed

function normalizePlainText(text: string) {
  return text.replaceAll('\r\n', '\n');
}

function deltaTextToString(delta: unknown): string {
  if (!Array.isArray(delta)) {
    return '';
  }

  return delta
    .map(entry => {
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      const insert = Reflect.get(entry, 'insert');
      return typeof insert === 'string' ? insert : '';
    })
    .join('');
}

function blockSnapshotToPlainText(snapshot: BlockSnapshot): string {
  if (typeof snapshot.props.text === 'string') {
    return snapshot.props.text;
  }

  if (snapshot.props.text && typeof snapshot.props.text === 'object') {
    return deltaTextToString(Reflect.get(snapshot.props.text, 'delta'));
  }

  return snapshot.children
    .map(child => blockSnapshotToPlainText(child))
    .filter(Boolean)
    .join('\n');
}

function snapshotsToPlainText(snapshots: BlockSnapshot[]) {
  return normalizePlainText(
    snapshots
      .map(snapshot => blockSnapshotToPlainText(snapshot))
      .filter(Boolean)
      .join('\n')
  );
}

interface CanvasExportOptions {
  dpr?: number;
  padding?: number;
  background?: string;
}

export class EdgelessClipboardController extends ReadOnlyClipboard {
  static override key = 'linvo-edgeless-clipboard';

  protected _init = () => {
    this._initAdapters();
    const paste = pasteMiddleware(this.std);
    const surfaceRefToEmbedMiddleware = surfaceRefToEmbed(this.std);
    const replaceId = replaceIdMiddleware(this.std.store.docSource.idGenerator);
    const upload = uploadMiddleware(this.std);
    this.std.clipboard.use(paste);
    this.std.clipboard.use(surfaceRefToEmbedMiddleware);
    this.std.clipboard.use(replaceId);
    this.std.clipboard.use(upload);
    this._disposables.add({
      dispose: () => {
        this.std.clipboard.unuse(paste);
        this.std.clipboard.unuse(surfaceRefToEmbedMiddleware);
        this.std.clipboard.unuse(replaceId);
        this.std.clipboard.unuse(upload);
      },
    });
  };

  private readonly _initEdgelessClipboard = () => {
    this.std.event.add('copy', ctx => {
      const { surfaceSelections, selectedIds } = this.selectionManager;

      if (selectedIds.length === 0) return false;

      this._onCopy(ctx, surfaceSelections).catch(console.error);
      return;
    });

    this.std.event.add('paste', ctx => {
      this._onPaste(ctx).catch(console.error);
    });

    this.std.event.add('cut', ctx => {
      this._onCut(ctx).catch(console.error);
    });
  };

  private readonly _onCopy = async (
    _context: UIEventStateContext,
    surfaceSelection: SurfaceSelection[]
  ) => {
    const event = _context.get('clipboardState').raw;
    event.preventDefault();

    const elements = getSortedCloneElements(
      this.selectionManager.selectedElements
    );

    // when note active, handle copy like page mode
    if (surfaceSelection[0] && surfaceSelection[0].editing) {
      // use build-in copy handler in rich-text when copy in surface text element
      if (isCanvasElementWithText(elements[0])) return;
      return;
    }

    // Only when an image is selected, it can be pasted normally to page mode.
    if (elements.length === 1 && isImageBlock(elements[0])) {
      const element = elements[0];
      const sourceId = element.props.sourceId$.peek();
      if (!sourceId) return;

      await this.std.clipboard.writeToClipboard(async items => {
        const job = this.std.store.getTransformer();
        await job.assetsManager.readFromBlob(sourceId);

        let blob = job.assetsManager.getAssets().get(sourceId) ?? null;
        if (!blob) {
          return items;
        }

        let type = blob.type;
        let supported = false;

        try {
          supported = ClipboardItem?.supports(type) ?? false;
        } catch (err) {
          console.error(err);
        }

        // TODO(@fundon): when converting jpeg to png, image may become larger and exceed the limit.
        if (!supported) {
          type = 'image/png';
          blob = await convertToPng(blob);
        }

        if (blob) {
          return {
            ...items,
            [`${type}`]: blob,
          };
        }

        return items;
      });

      return;
    }

    await this.std.clipboard.writeToClipboard(async _items => {
      const data = await prepareClipboardData(elements, this.std);
      return {
        ..._items,
        [BLOCKSUITE_SURFACE]: JSON.stringify(data),
      };
    });
  };

  private readonly _onCut = async (_context: UIEventStateContext) => {
    const { surfaceSelections, selectedElements } = this.selectionManager;

    if (selectedElements.length === 0) return;

    const event = _context.get('clipboardState').event;
    event.preventDefault();

    await this._onCopy(_context, surfaceSelections);

    if (surfaceSelections[0]?.editing) {
      // use build-in cut handler in rich-text when cut in surface text element
      if (isCanvasElementWithText(selectedElements[0])) return;
      return;
    }

    const elements = getSortedCloneElements(
      this.selectionManager.selectedElements
    );
    this.doc.transact(() => {
      this.crud.deleteElements(elements);
    });

    this.selectionManager.set({
      editing: false,
      elements: [],
    });
  };

  private readonly _onPaste = async (_context: UIEventStateContext) => {
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return;
    }
    const event = _context.get('clipboardState').raw;
    event.preventDefault();

    const { surfaceSelections, selectedElements } = this.selectionManager;

    if (surfaceSelections[0]?.editing) {
      // use build-in paste handler in rich-text when paste in surface text element
      if (isCanvasElementWithText(selectedElements[0])) return;
      return;
    }

    const data = event.clipboardData;
    if (!data) return;

    if (!this.surface) return;

    const lastMousePos = this.toolManager.lastMousePos$.peek();
    const point: IVec = [lastMousePos.x, lastMousePos.y];

    if (isPureFileInClipboard(data)) {
      const files = data.files;
      if (files.length === 0) return;

      const imageFiles: File[] = [],
        attachmentFiles: File[] = [];

      [...files].forEach(file => {
        if (file.type.startsWith('image/')) {
          imageFiles.push(file);
        } else {
          attachmentFiles.push(file);
        }
      });

      // when only images in clipboard, add image-blocks else add all files as attachments
      if (attachmentFiles.length === 0) {
        await addImages(this.std, imageFiles, {
          point,
          maxWidth: MAX_IMAGE_WIDTH,
          shouldTransformPoint: false,
        });
      } else {
        await addAttachments(this.std, [...files], point, false);
      }

      this.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
        control: 'canvas:paste',
        page: 'whiteboard editor',
        module: 'toolbar',
        segment: 'toolbar',
        type: attachmentFiles.length === 0 ? 'image' : 'attachment',
      });

      return;
    }

    if (isUrlInClipboard(data)) {
      const url = data.getData('text/plain');
      const { x, y } = this.toolManager.lastMousePos$.peek();
      const options: Record<string, unknown> = {};
      options.url = url;

      let flavour: string | null = null;
      let style: EmbedCardStyle | undefined;
      let width = EMBED_IFRAME_DEFAULT_WIDTH_IN_SURFACE;
      let height = EMBED_IFRAME_DEFAULT_HEIGHT_IN_SURFACE;

      const embedOptions = this.std
        .get(EmbedOptionProvider)
        .getEmbedBlockOptions(url);
      if (embedOptions) {
        style = embedOptions.styles[0];
        flavour = embedOptions.flavour;
        width = EMBED_CARD_WIDTH[style];
        height = EMBED_CARD_HEIGHT[style];
        options.style = style;
      } else {
        const embedIframeService = this.std.getOptional(EmbedIframeService);
        const config = embedIframeService?.getConfig(url);
        if (!config) {
          return;
        }

        flavour = 'linvo:embed-iframe';
        width = config.options?.widthInSurface ?? width;
        height = config.options?.heightInSurface ?? height;
      }

      options.xywh = Bound.fromCenter(
        Vec.toVec({
          x,
          y,
        }),
        width,
        height
      ).serialize();
      if (style) {
        options.style = style;
      }

      const id = this.crud.addBlock(flavour, options, this.surface.model.id);

      this.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
        control: 'canvas:paste',
        page: 'whiteboard editor',
        module: 'toolbar',
        segment: 'toolbar',
        type: flavour.split(':')[1],
      });

      this.std
        .getOptional(TelemetryProvider)
        ?.track('Link', {
          page: 'whiteboard editor',
          segment: 'whiteboard',
          category: 'pasted link',
          other: 'external link',
          type: 'link',
        });

      this.selectionManager.set({
        editing: false,
        elements: [id],
      });

      return;
    }

    const svg = tryGetSvgFromClipboard(data);
    if (svg) {
      await addImages(this.std, [svg], { point, maxWidth: MAX_IMAGE_WIDTH });
      return;
    }
    try {
      // check for surface elements in clipboard
      const json = this.std.clipboard.readFromClipboard(data);
      const mayBeSurfaceDataJson = json[BLOCKSUITE_SURFACE];
      if (mayBeSurfaceDataJson !== undefined) {
        const elementsRawData = JSON.parse(mayBeSurfaceDataJson);
        const { snapshot, blobs } = elementsRawData;
        const job = this.std.store.getTransformer();
        const map = job.assetsManager.getAssets();
        decodeClipboardBlobs(blobs, map);
        for (const blobId of map.keys()) {
          await job.assetsManager.writeToBlob(blobId);
        }
        await this._pasteShapesAndBlocks(snapshot);
        return;
      }
      // check for slice snapshot in clipboard
      const mayBeSliceDataJson = json[ClipboardAdapter.MIME];
      if (mayBeSliceDataJson === undefined) return;
      const clipData = JSON.parse(mayBeSliceDataJson);
      const sliceSnapShot = clipData?.snapshot as SliceSnapshot;
      await this._pasteTextContentAsText(sliceSnapShot.content);
    } catch {
      // if it is not parsable
      await this._pasteTextContentAsText(data.getData('text/plain'));
    }
  };

  private get _exportManager() {
    return this.std.getOptional(ExportManager);
  }

  private get doc() {
    return this.std.store;
  }

  private get selectionManager() {
    return this.gfx.selection;
  }

  private get surface() {
    return getSurfaceComponent(this.std);
  }

  private get frame() {
    return this.std.get(EdgelessFrameManagerIdentifier);
  }

  private get gfx() {
    return this.std.get(GfxControllerIdentifier);
  }

  private get crud() {
    return this.std.get(EdgelessCRUDIdentifier);
  }

  private get toolManager() {
    return this.gfx.tool;
  }

  private _checkCanContinueToCanvas(
    host: EditorHost,
    pathName: string,
    editorMode: boolean
  ) {
    if (
      location.pathname !== pathName ||
      isInsidePageEditor(host) !== editorMode
    ) {
      throw new Error('Unable to export content to canvas');
    }
  }

  private async _edgelessToCanvas(
    bound: IBound,
    nodes?: GfxBlockElementModel[],
    canvasElements: GfxPrimitiveElementModel[] = [],
    {
      background,
      padding = IMAGE_PADDING,
      dpr = window.devicePixelRatio || 1,
    }: CanvasExportOptions = {}
  ): Promise<HTMLCanvasElement | undefined> {
    const host = this.std.host;
    const rootModel = this.doc.root;
    if (!rootModel) return;

    const html2canvas = (await import('html2canvas')).default;
    if (!(html2canvas instanceof Function)) return;
    if (!this.surface) return;

    const pathname = location.pathname;
    const editorMode = isInsidePageEditor(host);

    const canvas = document.createElement('canvas');
    canvas.width = (bound.w + padding * 2) * dpr;
    canvas.height = (bound.h + padding * 2) * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.scale(dpr, dpr);

    const replaceImgSrcWithSvg = this._exportManager?.replaceImgSrcWithSvg;

    const imageProxy = host.std.clipboard.configs.get('imageProxy');
    const html2canvasOption = {
      ignoreElements: function (element: Element) {
        if (
          CANVAS_EXPORT_IGNORE_TAGS.includes(element.tagName) ||
          element.classList.contains('dg')
        ) {
          return true;
        } else {
          return false;
        }
      },

      onclone: async function (documentClone: Document, element: HTMLElement) {
        // html2canvas can't support transform feature
        element.style.setProperty('transform', 'none');
        const layer = documentClone.querySelector('.linvo-edgeless-layer');
        if (layer && layer instanceof HTMLElement) {
          layer.style.setProperty('transform', 'none');
        }

        const boxShadowElements = documentClone.querySelectorAll(
          "[style*='box-shadow']"
        );
        boxShadowElements.forEach(function (element) {
          if (element instanceof HTMLElement) {
            element.style.setProperty('box-shadow', 'none');
          }
        });
        await replaceImgSrcWithSvg?.(element);
      },
      backgroundColor: 'transparent',
      useCORS: imageProxy ? false : true,
      proxy: imageProxy,
    };

    const _drawTopLevelBlock = async (
      block: GfxBlockElementModel,
      isInFrame = false
    ) => {
      const blockComponent = this.std.view.getBlock(block.id);
      if (!blockComponent) {
        throw new LinvoError(
          ErrorCode.EdgelessExportError,
          'Could not find edgeless block component.'
        );
      }

      const blockBound = Bound.deserialize(block.xywh);
      const canvasData = await html2canvas(
        blockComponent as HTMLElement,
        html2canvasOption
      );
      ctx.drawImage(
        canvasData,
        blockBound.x - bound.x + padding,
        blockBound.y - bound.y + padding,
        blockBound.w,
        isInFrame
          ? (blockBound.w / canvasData.width) * canvasData.height
          : blockBound.h
      );
    };

    const nodeElements =
      nodes ??
      (this.gfx.getElementsByBound(bound, {
        type: 'block',
      }) as GfxBlockElementModel[]);
    for (const nodeElement of nodeElements) {
      await _drawTopLevelBlock(nodeElement);

      if (matchModels(nodeElement, [FrameBlockModel])) {
        const blocksInsideFrame: GfxBlockElementModel[] = [];
        this.frame.getElementsInFrameBound(nodeElement, false).forEach(ele => {
          if (isTopLevelBlock(ele)) {
            blocksInsideFrame.push(ele as GfxBlockElementModel);
          } else {
            canvasElements.push(ele as GfxPrimitiveElementModel);
          }
        });

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < blocksInsideFrame.length; i++) {
          const element = blocksInsideFrame[i];
          await _drawTopLevelBlock(element, true);
        }
      }

      this._checkCanContinueToCanvas(host, pathname, editorMode);
    }

    // TODO: handle DOM renderer case for clipboard image generation
    if (!(this.surface.renderer instanceof CanvasRenderer)) {
      console.warn(
        'Skipping canvas generation for clipboard: DOM renderer active.'
      );
      return canvas; // Return the empty canvas or handle error
    }

    const surfaceCanvas = this.surface.renderer.getCanvasByBound(
      bound,
      canvasElements
    );
    ctx.drawImage(surfaceCanvas, padding, padding, bound.w, bound.h);

    return canvas;
  }

  private _emitSelectionChangeAfterPaste(
    canvasElementIds: string[],
    blockIds: string[]
  ) {
    const newSelected = [
      ...canvasElementIds,
      ...blockIds.filter(id => {
        return isTopLevelBlock(this.doc.getModelById(id));
      }),
    ];

    this.selectionManager.set({
      editing: false,
      elements: newSelected,
    });
  }

  private async _pasteShapesAndBlocks(
    elementsRawData: (SerializedElement | BlockSnapshot)[]
  ) {
    const [_, { createdElementsPromise }] = this.std.command.exec(
      createElementsFromClipboardDataCommand,
      {
        elementsRawData,
      }
    );
    if (!createdElementsPromise) return;
    const { canvasElements, blockModels } = await createdElementsPromise;
    this._emitSelectionChangeAfterPaste(
      canvasElements.map(ele => ele.id),
      blockModels.map(block => block.id)
    );
  }

  private async _pasteTextContentAsText(content: BlockSnapshot[] | string) {
    if (content === '') {
      return;
    }

    const { x, y } = this.toolManager.lastMousePos$.peek();
    const text =
      typeof content === 'string'
        ? normalizePlainText(splitIntoLines(content).join('\n'))
        : snapshotsToPlainText(content);

    if (!text) {
      return;
    }

    const textId = this.crud.addElement(CanvasElementType.TEXT, {
      xywh: new Bound(x, y, 120, 28).serialize(),
      text: new PlainText(text),
      textAlign: 'left',
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
    });
    if (textId == null) {
      return;
    }

    this.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
      control: 'canvas:paste',
      page: 'whiteboard editor',
      module: 'toolbar',
      segment: 'toolbar',
      type: 'text',
    });

    this.gfx.selection.set({
      elements: [textId],
      editing: false,
    });
    this.gfx.tool.setTool(DefaultTool);
  }

  copy() {
    document.dispatchEvent(
      new Event('copy', {
        bubbles: true,
        cancelable: true,
      })
    );
  }

  override mounted() {
    if (!navigator.clipboard) {
      console.error(
        'navigator.clipboard is not supported in current environment.'
      );
      return;
    }
    if (this._disposables.disposed) {
      this._disposables = new DisposableGroup();
    }
    this._init();
    this._initEdgelessClipboard();
  }

  async toCanvas(
    blocks: GfxBlockElementModel[],
    shapes: ShapeElementModel[],
    options?: CanvasExportOptions
  ) {
    blocks.sort(compareLayer);
    shapes.sort(compareLayer);

    const bounds: IBound[] = [];
    blocks.forEach(block => {
      bounds.push(Bound.deserialize(block.xywh));
    });
    shapes.forEach(shape => {
      bounds.push(shape.elementBound);
    });
    const bound = getCommonBound(bounds);
    if (!bound) {
      console.error('bound not exist');
      return;
    }

    const canvas = await this._edgelessToCanvas(bound, blocks, shapes, options);
    return canvas;
  }
}
