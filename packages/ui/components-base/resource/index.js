import { defineCustomElement } from '@linvo-core/global/utils';
import { ResourceStatus } from './status';
export * from './resource';
export * from './status';
export function effects() {
    defineCustomElement('linvo-resource-status', ResourceStatus);
}
