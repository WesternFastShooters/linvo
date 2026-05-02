import { LinvoError } from '@linvo-core/global/exceptions';
// store active poppers
const popMap = new WeakMap();
function animateEnter(el) {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
}
function animateLeave(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
}
export function createPopper(tagName, reference, options) {
    const duration = options?.duration ?? 230;
    if (!popMap.has(reference))
        popMap.set(reference, new Map());
    const elMap = popMap.get(reference);
    // if there is already a popper, cancel leave transition and apply enter transition
    if (elMap && elMap.has(tagName)) {
        const popper = elMap.get(tagName);
        if (popper) {
            popper.cancel?.();
            requestAnimationFrame(() => animateEnter(popper.element));
            return popper;
        }
    }
    const clipWrapper = document.createElement('div');
    const menu = document.createElement(tagName);
    options?.setProps?.(menu);
    clipWrapper.append(menu);
    if (!reference.shadowRoot) {
        throw new LinvoError(LinvoError.ErrorCode.ValueNotExists, 'reference must be a shadow root');
    }
    reference.shadowRoot.append(clipWrapper);
    // apply enter transition
    menu.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    animateLeave(menu);
    requestAnimationFrame(() => animateEnter(menu));
    Object.assign(clipWrapper.style, {
        height: 'auto',
        pointerEvents: 'none',
        position: 'absolute',
        overflow: 'visible',
        width: 'max-content',
        maxWidth: 'max-content',
        boxSizing: 'border-box',
        left: '50%',
        top: 'calc(100% + 8px)',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: '10',
    });
    Object.assign(menu.style, {
        width: 'max-content',
        maxWidth: 'min(480px, calc(100vw - 32px))',
        pointerEvents: 'auto',
    });
    const remove = () => {
        clipWrapper.remove();
        menu.remove();
        popMap.get(reference)?.delete(tagName);
        options?.onDispose?.();
    };
    const popper = {
        element: menu,
        dispose: () => {
            // apply leave transition
            animateLeave(menu);
            menu.addEventListener('transitionend', remove, { once: true });
            popper.cancel = () => menu.removeEventListener('transitionend', remove);
        },
    };
    popMap.get(reference)?.set(tagName, popper);
    return popper;
}
