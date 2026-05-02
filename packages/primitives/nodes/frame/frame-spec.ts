import { FrameBlockSchema } from '@linvo-core/content';
import { BlockViewExtension } from '@linvo-core/std';
import type { ExtensionType } from '@linvo-core/store';
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
