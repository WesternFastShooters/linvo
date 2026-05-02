import { Container, type ServiceProvider } from '@linvo-core/composition/di';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import {
  type ExtensionType,
  type Store,
  StoreSelectionExtension,
} from '@linvo-core/store';

import { Clipboard } from '../clipboard';
import { CommandManager } from '../command';
import { UIEventDispatcher } from '../event';
import { DndController } from '../extension/dnd';
import { EditorLifeCycleExtension } from '../extension/editor-life-cycle';
import { ServiceManager } from '../extension/service-manager';
import { GfxController } from '../gfx/controller';
import { GridManager, LayerManager } from '../gfx';
import { GfxSelectionManager } from '../gfx/selection';
import { SurfaceMiddlewareExtension } from '../gfx/surface-middleware';
import { ViewManager } from '../gfx/view/view-manager';
import {
  BlockViewIdentifier,
  LifeCycleWatcherIdentifier,
  StdIdentifier,
} from '../identifier';
import { RangeManager } from '../inline';
import { EditorHost } from '../dom/element';
import { ViewStore } from '../dom/view-store';

export interface BlockStdOptions {
  store: Store;
  extensions: ExtensionType[];
}

const internalExtensions = [
  ServiceManager,
  CommandManager,
  UIEventDispatcher,
  RangeManager,
  ViewStore,
  Clipboard,
  GfxController,
  GfxSelectionManager,
  GridManager,
  LayerManager,
  SurfaceMiddlewareExtension,
  ViewManager,
  DndController,
  EditorLifeCycleExtension,
];

export class BlockStdScope {
  static internalExtensions = internalExtensions;

  readonly container: Container;

  readonly store: Store;

  readonly provider: ServiceProvider;

  readonly userExtensions: ExtensionType[];

  private get _lifeCycleWatchers() {
    return this.provider.getAll(LifeCycleWatcherIdentifier);
  }

  private _host!: EditorHost;

  get dnd() {
    return this.get(DndController);
  }

  get clipboard() {
    return this.get(Clipboard);
  }

  get docSource() {
    return this.store.docSource;
  }

  get command() {
    return this.get(CommandManager);
  }

  get event() {
    return this.get(UIEventDispatcher);
  }

  get get() {
    return this.provider.get.bind(this.provider);
  }

  get getOptional() {
    return this.provider.getOptional.bind(this.provider);
  }

  get host() {
    if (!this._host) {
      throw new LinvoError(
        ErrorCode.ValueNotExists,
        'Host is not ready to use, the `render` method should be called first'
      );
    }

    return this._host;
  }

  get range() {
    return this.get(RangeManager);
  }

  get selection() {
    return this.get(StoreSelectionExtension);
  }

  get view() {
    return this.get(ViewStore);
  }

  constructor(options: BlockStdOptions) {
    this.store = options.store;
    this.userExtensions = options.extensions;
    this.container = new Container();
    this.container.addImpl(StdIdentifier, () => this);

    internalExtensions.forEach(ext => {
      const container = this.container;
      ext.setup(container);
    });

    this.userExtensions.forEach(ext => {
      const container = this.container;
      ext.setup(container);
    });

    this.provider = this.container.provider(undefined, this.store.provider);

    this._lifeCycleWatchers.forEach(watcher => {
      watcher.created();
    });
  }

  getView(flavour: string) {
    return this.getOptional(BlockViewIdentifier(flavour));
  }

  mount() {
    this._lifeCycleWatchers.forEach(watcher => {
      watcher.mounted();
    });
  }

  render() {
    const element = new EditorHost();
    element.std = this;
    element.store = this.store;
    this._host = element;
    this._lifeCycleWatchers.forEach(watcher => {
      watcher.rendered();
    });

    return element;
  }

  unmount() {
    this._lifeCycleWatchers.forEach(watcher => {
      watcher.unmounted();
    });
  }
}
