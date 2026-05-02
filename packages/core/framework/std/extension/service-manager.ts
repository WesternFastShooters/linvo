import { LifeCycleWatcher } from '../extension';
import { BlockServiceIdentifier } from '../identifier';

export class ServiceManager extends LifeCycleWatcher {
  static override readonly key = 'serviceManager';

  override mounted() {
    super.mounted();

    this.std.provider.getAll(BlockServiceIdentifier).forEach(service => {
      service.mounted();
    });
  }

  override unmounted() {
    super.unmounted();

    this.std.provider.getAll(BlockServiceIdentifier).forEach(service => {
      service.unmounted();
    });
  }
}
