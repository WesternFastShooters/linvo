import './style.css';

import { Text } from '@linvo/linvo/store';
import {
  createAutoIncrementIdGenerator,
  TestWorkspace,
} from '@linvo/linvo/store/test';
import { effects as integrationEffects } from '@linvo/integration-test/effects';

import { configureEditor, createEditor } from './editor';
import { whiteboardStoreExtensionManager } from './extensions';

integrationEffects();

async function bootstrap() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app container');
  }

  const workspace = new TestWorkspace({
    id: 'linvo',
    idGenerator: createAutoIncrementIdGenerator(),
  });
  workspace.storeExtensions = whiteboardStoreExtensionManager.get('store');
  workspace.start();
  workspace.meta.initialize();

  const doc = workspace.createDoc('doc:whiteboard');
  const store = doc.getStore({ id: doc.id });
  store.load();

  const rootId = store.addBlock('linvo:root', {
    title: new Text('Linvo'),
  });
  store.addBlock('linvo:surface', {}, rootId);
  store.resetHistory();

  const editor = createEditor(store, workspace);

  const shell = document.createElement('div');
  shell.className = 'shell';
  shell.innerHTML = `
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
    app.textContent = `Failed to start Linvo: ${detail}`;
  }
});
