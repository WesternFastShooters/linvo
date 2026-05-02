import type { GfxPrimitiveElementModel } from '../element-model';
import { getObjectPropMeta, setObjectPropMeta } from './common';

const observeSymbol = Symbol('observe');
const observerDisposableSymbol = Symbol('observerDisposable');

type ObserveFn<
  E = unknown,
  T extends GfxPrimitiveElementModel = GfxPrimitiveElementModel,
> = (
  /**
   * The event object from the observable field. `null` means the observer is initializing.
   */
  event: E | null,
  instance: T,
  /**
   * The transaction object from the observable field. `null` means the observer is initializing.
   */
  transaction: any | null
) => void;

/**
 * A decorator to observe an observable field.
 * You can think of it as a decorator version of an object's `observe` method.
 *
 * The observer function start to observe the property when the model is mounted. And it will
 * re-observe the property automatically when the value is altered.
 * @param fn
 * @returns
 */
export function observe<
  V,
  E,
  T extends GfxPrimitiveElementModel,
>(fn: ObserveFn<E, T>) {
  return function observeDecorator(
    _: unknown,
    context: ClassAccessorDecoratorContext
  ) {
    const prop = context.name;
    return {
      init(this: T, v: V) {
        setObjectPropMeta(observeSymbol, Object.getPrototypeOf(this), prop, fn);
        return v;
      },
    } as ClassAccessorDecoratorResult<GfxPrimitiveElementModel, V>;
  };
}

function getObserveMeta(
  proto: unknown,
  prop: string | symbol
): null | ObserveFn {
  return getObjectPropMeta(proto, observeSymbol, prop);
}

export function startObserve(
  prop: string | symbol,
  receiver: GfxPrimitiveElementModel
) {
  const proto = Object.getPrototypeOf(receiver);
  const observeFn = getObserveMeta(proto, prop as string)!;
  // @ts-expect-error ignore
  const observerDisposable = receiver[observerDisposableSymbol] ?? {};

  // @ts-expect-error ignore
  receiver[observerDisposableSymbol] = observerDisposable;

  if (observerDisposable[prop]) {
    observerDisposable[prop]();
    delete observerDisposable[prop];
  }

  if (!observeFn) {
    return;
  }

  const value = receiver[prop as keyof GfxPrimitiveElementModel] as
    | {
        observe(
          callback: (
            event: unknown,
            transaction?: any
          ) => void
        ): (() => void) | void;
        unobserve?: (
          callback: (
            event: unknown,
            transaction?: any
          ) => void
        ) => void;
      }
    | null;

  observeFn(null, receiver, null);

  const fn = (event: unknown, transaction?: any) => {
    observeFn(event, receiver, transaction ?? null);
  };

  if (value && 'observe' in value) {
    const maybeDispose = value.observe(fn);

    observerDisposable[prop] = () => {
      if (typeof maybeDispose === 'function') {
        maybeDispose();
        return;
      }

      value.unobserve?.(fn);
    };
  } else {
    console.warn(
      `Failed to observe "${prop.toString()}" of ${
        receiver.type
      } element, make sure it's observable.`
    );
  }
}

export function initializeObservers(
  proto: unknown,
  receiver: GfxPrimitiveElementModel
) {
  const observers = getObjectPropMeta(proto, observeSymbol);

  Object.keys(observers).forEach(prop => {
    startObserve(prop, receiver);
  });

  receiver['_disposable'].add(() => {
    // @ts-expect-error ignore
    Object.values(receiver[observerDisposableSymbol] ?? {}).forEach(dispose =>
      (dispose as () => void)()
    );
  });
}
