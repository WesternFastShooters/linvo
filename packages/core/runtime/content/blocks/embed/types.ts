import type { GfxModel } from '@linvo-core/std/gfx';
import type { BlockModel } from '@linvo-core/store';

import { EmbedFigmaModel } from './figma';
import { EmbedGithubModel } from './github';
import type { EmbedHtmlModel } from './html';
import type { EmbedIframeBlockModel } from './iframe/';
import { EmbedLoomModel } from './loom';
import { EmbedSyncedDocModel } from './synced-doc';
import { EmbedYoutubeModel } from './youtube';

export const ExternalEmbedModels = [
  EmbedFigmaModel,
  EmbedGithubModel,
  EmbedLoomModel,
  EmbedYoutubeModel,
] as const;

export const InternalEmbedModels = [
  EmbedSyncedDocModel,
] as const;

export type ExternalEmbedModel = (typeof ExternalEmbedModels)[number];

export type InternalEmbedModel = (typeof InternalEmbedModels)[number];

export type EmbedCardModel = InstanceType<
  ExternalEmbedModel | InternalEmbedModel
>;

export type LinkableEmbedModel =
  | EmbedCardModel
  | EmbedIframeBlockModel;

export type BuiltInEmbedModel = EmbedCardModel | EmbedHtmlModel;

export function isExternalEmbedModel(
  model: GfxModel | BlockModel
): model is InstanceType<ExternalEmbedModel> {
  return (
    model instanceof EmbedFigmaModel ||
    model instanceof EmbedGithubModel ||
    model instanceof EmbedLoomModel ||
    model instanceof EmbedYoutubeModel
  );
}

export function isInternalEmbedModel(
  model: GfxModel | BlockModel
): model is InstanceType<InternalEmbedModel> {
  return model instanceof EmbedSyncedDocModel;
}
