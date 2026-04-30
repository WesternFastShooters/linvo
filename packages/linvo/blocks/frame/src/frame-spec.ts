import { FrameBlockSchema } from '@linvo/linvo-model';
import { BlockViewExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

import { FrameBlockInteraction } from './frame-block';
import { EdgelessFrameManager, FrameOverlay } from './frame-manager';

const flavour = FrameBlockSchema.model.flavour;

export const FrameBlockSpec: ExtensionType[] = [
  BlockViewExtension(flavour, literal`linvo-frame`),
  FrameOverlay,
  EdgelessFrameManager,
  FrameBlockInteraction,
];
