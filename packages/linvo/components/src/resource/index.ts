import { ResourceStatus } from './status';

export * from './resource';
export * from './status';

export function effects() {
  customElements.define('linvo-resource-status', ResourceStatus);
}
