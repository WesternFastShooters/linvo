import './style.css';

import { Text } from '@blocksuite/affine/store';
import {
  createAutoIncrementIdGenerator,
  TestWorkspace,
} from '@blocksuite/affine/store/test';
import { effects as integrationEffects } from '@blocksuite/integration-test/effects';

import { configureEditor, createEditor } from './editor';
import { whiteboardStoreExtensionManager } from './extensions';

integrationEffects();

async function bootstrap() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app container');
  }

  const workspace = new TestWorkspace({
    id: 'best-excalidraw',
    idGenerator: createAutoIncrementIdGenerator(),
  });
  workspace.storeExtensions = whiteboardStoreExtensionManager.get('store');
  workspace.start();
  workspace.meta.initialize();

  const doc = workspace.createDoc('doc:whiteboard');
  const store = doc.getStore({ id: doc.id });
  store.load();

  const rootId = store.addBlock('affine:page', {
    title: new Text('Best Excalidraw'),
  });
  store.addBlock('affine:surface', {}, rootId);
  store.resetHistory();

  const editor = createEditor(store, workspace);

  const shell = document.createElement('div');
  shell.className = 'shell';
  shell.innerHTML = `
    <header class="shell-header">
      <div class="shell-title">
        <h1>Best Excalidraw</h1>
        <p>BlockSuite edgeless extracted with brush, eraser, shapes and mindmap</p>
      </div>
      <div class="shell-note">默认进入白板模式</div>
    </header>
    <main class="editor-shell"></main>
  `;

  shell.querySelector('.editor-shell')?.append(editor);
  app.append(shell);
  await editor.updateComplete;
  await configureEditor(editor);

  Object.assign(window, {
    editor,
    workspace,
    doc: store,
  });
}

bootstrap().catch(error => {
  console.error(error);
  const app = document.getElementById('app');
  if (app) {
    const detail =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack ?? ''}`
        : String(error);
    app.textContent = `Failed to start Best Excalidraw: ${detail}`;
  }
});
