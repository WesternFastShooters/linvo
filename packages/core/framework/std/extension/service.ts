import type { Container } from '@linvo-core/composition/di';
import { DisposableGroup } from '@linvo-core/global/disposable';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Extension } from '@linvo-core/store';

import type { EventName, UIEventHandler } from '../event';
import {
  BlockFlavourIdentifier,
  BlockServiceIdentifier,
  StdIdentifier,
} from '../identifier';
import type { BlockStdScope } from '../scope';

/**
 * @deprecated
 * BlockService is deprecated. You should reconsider where to put your feature.
 *
 * BlockService is a legacy extension that is used to provide services to the block.
 * In the previous version of the editor framework, block service provided a way to extend a block.
 * However, in the new version, we recommend using the new extension system.
 */
export abstract class BlockService extends Extension {
  static flavour: string;

  readonly disposables = new DisposableGroup();

  readonly flavour: string;

  get collection() {
    return this.std.docSource;
  }

  get doc() {
    return this.std.store;
  }

  get host() {
    return this.std.host;
  }

  get selectionManager() {
    return this.std.selection;
  }

  get uiEventDispatcher() {
    return this.std.event;
  }

  constructor(
    readonly std: BlockStdScope,
    readonly flavourProvider: { flavour: string }
  ) {
    super();
    this.flavour = flavourProvider.flavour;
  }

  static override setup(di: Container) {
    if (!this.flavour) {
      throw new LinvoError(
        ErrorCode.ValueNotExists,
        'Flavour is not defined in the BlockService'
      );
    }
    di.add(
      this as unknown as {
        new (
          std: BlockStdScope,
          flavourProvider: { flavour: string }
        ): BlockService;
      },
      [StdIdentifier, BlockFlavourIdentifier(this.flavour)]
    );
    di.addImpl(BlockServiceIdentifier(this.flavour), provider =>
      provider.get(this)
    );
  }

  bindHotKey(
    keymap: Record<string, UIEventHandler>,
    options?: { global: boolean }
  ) {
    this.disposables.add(
      this.uiEventDispatcher.bindHotkey(keymap, {
        flavour: options?.global ? undefined : this.flavour,
      })
    );
  }

  // life cycle start
  dispose() {
    this.disposables.dispose();
  }

  // event handlers start
  handleEvent(
    name: EventName,
    fn: UIEventHandler,
    options?: { global: boolean }
  ) {
    this.disposables.add(
      this.uiEventDispatcher.add(name, fn, {
        flavour: options?.global ? undefined : this.flavour,
      })
    );
  }
  // life cycle end

  mounted() {}

  unmounted() {
    this.disposables.dispose();
  }
}
