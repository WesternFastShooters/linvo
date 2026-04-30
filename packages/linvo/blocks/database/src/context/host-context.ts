import { createIdentifier } from '@linvo/global/di';
import type { EditorHost } from '@linvo/std';

export const EditorHostKey = createIdentifier<EditorHost>('editor-host');
