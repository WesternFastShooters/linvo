import './style.css';

import {
  type IdGenerator,
  createDocSource,
  initializeDocSource,
  Text,
} from '@linvo-core/store';

import { configureEditor, createEditor } from './editor';
import { installAppEffects } from './effects';
import { whiteboardStoreExtensionManager } from './extensions';

installAppEffects();

function createSequentialIdGenerator(): IdGenerator {
  let index = 0;
  return () => `${index++}`;
}

async function bootstrap() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app container');
  }

  const whiteboardDataSource = createDocSource({
    id: 'linvo',
    idGenerator: createSequentialIdGenerator(),
  });
  whiteboardDataSource.storeExtensions = whiteboardStoreExtensionManager.get(
    'store'
  );
  whiteboardDataSource.start();
  whiteboardDataSource.meta.initialize();

  const whiteboardRecord = initializeDocSource(
    whiteboardDataSource,
    'doc:whiteboard'
  );
  const whiteboardStore = whiteboardRecord.getStore({
    id: whiteboardRecord.id,
  });
  whiteboardStore.load();

  const whiteboardRootBlockId = whiteboardStore.addBlock('linvo:root', {
    title: new Text('Linvo'),
  });
  whiteboardStore.addBlock('linvo:surface', {}, whiteboardRootBlockId);
  whiteboardStore.resetHistory();

  const editor = createEditor(whiteboardStore);

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
    whiteboardDataSource,
    whiteboardRecord,
    whiteboardStore,
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
