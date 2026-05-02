import { BlockSchemaExtension } from '@linvo-core/store';

import { createEmbedBlockSchema } from '../../../helpers';
import {
  type EmbedGithubBlockProps,
  EmbedGithubModel,
  EmbedGithubStyles,
} from './github-model';

const defaultEmbedGithubProps: EmbedGithubBlockProps = {
  style: EmbedGithubStyles[1],
  owner: '',
  repo: '',
  githubType: 'issue',
  githubId: '',
  url: '',
  caption: null,

  image: null,
  status: null,
  statusReason: null,
  title: null,
  description: null,
  createdAt: null,
  assignees: null,
};

export const EmbedGithubBlockSchema = createEmbedBlockSchema({
  name: 'github',
  version: 1,
  toModel: () => new EmbedGithubModel(),
  props: (): EmbedGithubBlockProps => defaultEmbedGithubProps,
});

export const EmbedGithubBlockSchemaExtension = BlockSchemaExtension(
  EmbedGithubBlockSchema
);
