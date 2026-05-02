import { LifeCycleWatcher } from '@linvo-core/std';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';

export class EdgelessLocker extends LifeCycleWatcher {
  static override key = 'edgeless-locker';

  override mounted() {
    const { viewport } = this.std.get(GfxControllerIdentifier);
    viewport.locked = true;
  }
}
