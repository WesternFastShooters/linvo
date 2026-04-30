import { ImageLayoutHandlerExtension } from '@linvo/linvo/blocks/image';
import { ListLayoutHandlerExtension } from '@linvo/linvo/blocks/list';
import { ParagraphLayoutHandlerExtension } from '@linvo/linvo/blocks/paragraph';
import {
  TurboRendererConfigFactory,
  ViewportTurboRendererExtension,
  ViewportTurboRendererIdentifier,
} from '@linvo/linvo/gfx/turbo-renderer';

import { addSampleNotes } from './doc-generator.js';
import { createPainterWorker, setupEditor } from './setup.js';

async function init() {
  await setupEditor('edgeless', [
    ParagraphLayoutHandlerExtension,
    ListLayoutHandlerExtension,
    ImageLayoutHandlerExtension,
    TurboRendererConfigFactory({
      painterWorkerEntry: createPainterWorker,
    }),
    ViewportTurboRendererExtension,
  ]);
  addSampleNotes(doc, 100);
  doc.load();

  const renderer = editor.std.get(
    ViewportTurboRendererIdentifier
  ) as ViewportTurboRendererExtension;
  window.renderer = renderer;
}

await init();
