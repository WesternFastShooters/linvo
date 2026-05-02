import type { ExtensionType } from '@linvo-core/store';
import type { PeekViewService } from './type';
export declare const PeekViewProvider: import("@linvo-core/composition/di").ServiceIdentifier<PeekViewService> & (<U extends PeekViewService = PeekViewService>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare function PeekViewExtension(service: PeekViewService): ExtensionType;
