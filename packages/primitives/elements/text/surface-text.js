import { PlainTextEditor } from './plain-text-editor';
import { SURFACE_TEXT_UNIQ_IDENTIFIER } from '@linvo-core/std/gfx';
const surfaceTextBindingCache = new WeakMap();
function normalizeText(text) {
    return text.replaceAll('\r\n', '\n');
}
export function bindSurfaceText(text) {
    if (!text || typeof text !== 'object') {
        return null;
    }
    const cached = surfaceTextBindingCache.get(text);
    if (cached) {
        return cached;
    }
    const binding = {
        get length() {
            return text.length;
        },
        observe(listener) {
            if (typeof text.observe !== 'function') {
                return;
            }
            const observer = () => {
                listener({
                    local: true,
                    text: text.toString(),
                });
            };
            const maybeDispose = text.observe(observer);
            if (typeof maybeDispose === 'function') {
                return maybeDispose;
            }
            if (typeof text.unobserve === 'function') {
                return () => {
                    text.unobserve?.(observer);
                };
            }
        },
        set(nextText, local = true) {
            const normalized = normalizeText(nextText);
            if (typeof text.set === 'function') {
                text.set(normalized, local);
                return;
            }
            if (text.toString() === normalized) {
                return;
            }
            if (typeof text.delete !== 'function' || typeof text.insert !== 'function') {
                throw new Error('Surface text is not editable.');
            }
            if (text.length > 0) {
                text.delete(0, text.length);
            }
            if (normalized.length > 0) {
                text.insert(0, normalized);
            }
        },
        toString() {
            return text.toString();
        },
    };
    surfaceTextBindingCache.set(text, binding);
    return binding;
}
export function createSurfaceText(text = '') {
    const normalized = normalizeText(text);
    return {
        [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
        delta: normalized.length > 0 ? [{ insert: normalized }] : [],
    };
}
export { PlainTextEditor };
