import { type Container, createIdentifier } from '@linvo-core/composition/di';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Extension } from '@linvo-core/store';

import type { GfxController } from './controller';
import { GfxControllerIdentifier } from './identifiers';

export const GfxExtensionIdentifier =
  createIdentifier<GfxExtension>('GfxExtension');

export const GfxClassExtenderIdentifier = createIdentifier<{
  extendFn: (gfx: GfxController) => void;
}>('GfxClassExtender');

export abstract class GfxExtension extends Extension {
  static key: string;

  get std() {
    return this.gfx.std;
  }

  constructor(protected readonly gfx: GfxController) {
    super();
  }

  // This method is used to extend the GfxController
  static extendGfx(_: GfxController) {}

  static override setup(di: Container) {
    if (!this.key) {
      throw new LinvoError(
        ErrorCode.ValueNotExists,
        'key is not defined in the GfxExtension'
      );
    }

    di.addImpl(GfxClassExtenderIdentifier(this.key), {
      extendFn: this.extendGfx,
    });

    di.add(this as unknown as { new (gfx: GfxController): GfxExtension }, [
      GfxControllerIdentifier,
    ]);

    di.addImpl(GfxExtensionIdentifier(this.key), provider =>
      provider.get(this)
    );
  }

  mounted() {}

  unmounted() {}
}
