import { createIdentifier } from '@linvo-core/composition/di';
export const PeekViewProvider = createIdentifier('LinvoPeekViewProvider');
export function PeekViewExtension(service) {
    return {
        setup: di => {
            di.override(PeekViewProvider, () => service);
        },
    };
}
