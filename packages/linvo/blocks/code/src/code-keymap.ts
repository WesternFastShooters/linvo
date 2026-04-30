import { textKeymap } from '@linvo/linvo-inline-preset';
import { CodeBlockSchema } from '@linvo/linvo-model';
import { KeymapExtension } from '@linvo/std';

export const CodeKeymapExtension = KeymapExtension(textKeymap, {
  flavour: CodeBlockSchema.model.flavour,
});
