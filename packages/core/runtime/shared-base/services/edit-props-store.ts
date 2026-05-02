import { ColorSchema } from '@linvo-core/content';
import { DisposableGroup } from '@linvo-core/global/disposable';
import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import type { DeepPartial } from '@linvo-core/global/utils';
import { type BlockStdScope, LifeCycleWatcher } from '@linvo-core/std';
import { computed, type Signal, signal } from '@preact/signals-core';
import clonedeep from 'lodash-es/cloneDeep';
import mergeWith from 'lodash-es/mergeWith';
import { Subject } from 'rxjs';
import { Boxed, Text } from '@linvo-core/store';
import { z } from 'zod';

import { makeDeepOptional, NodePropsSchema } from '../utils';
import { EditorSettingProvider } from './editor-setting-service';

const LastPropsSchema = NodePropsSchema;
const OptionalPropsSchema = makeDeepOptional(NodePropsSchema);
export type LastProps = z.infer<typeof NodePropsSchema>;
export type LastPropsKey = keyof LastProps;

const SessionPropsSchema = z.object({
  templateCache: z.string(),
  remoteColor: z.string(),
  showBidirectional: z.boolean(),
});

const LocalPropsSchema = z.object({
  viewport: z.union([
    z.object({
      centerX: z.number(),
      centerY: z.number(),
      zoom: z.number(),
    }),
    z.object({
      xywh: z.string(),
      padding: z
        .tuple([z.number(), z.number(), z.number(), z.number()])
        .optional(),
    }),
  ]),
  presentBlackBackground: z.boolean(),
  presentFillScreen: z.boolean(),
  presentHideToolbar: z.boolean(),
  presentNoFrameToastShown: z.boolean(),

  autoHideEmbedHTMLFullScreenToolbar: z.boolean(),
});

type SessionProps = z.infer<typeof SessionPropsSchema>;
type LocalProps = z.infer<typeof LocalPropsSchema>;
type StorageProps = SessionProps & LocalProps;
type StoragePropsKey = keyof StorageProps;

function isLocalProp(key: string): key is keyof LocalProps {
  return key in LocalPropsSchema.shape;
}

function isSessionProp(key: string): key is keyof SessionProps {
  return key in SessionPropsSchema.shape;
}

function customizer(_target: unknown, source: unknown) {
  if (ColorSchema.safeParse(source).success) {
    return source;
  }

  if (source instanceof Text || source instanceof Boxed) {
    return source;
  }

  if (
    source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    Object.getPrototypeOf(source) !== Object.prototype
  ) {
    return source;
  }
  return;
}

export class EditPropsStore extends LifeCycleWatcher {
  static override key = 'EditPropsStore';

  private readonly _disposables = new DisposableGroup();

  private readonly innerProps$: Signal<DeepPartial<LastProps>> = signal({});

  lastProps$: Signal<LastProps>;

  slots = {
    storageUpdated: new Subject<{
      key: StoragePropsKey;
      value: StorageProps[StoragePropsKey];
    }>(),
  };

  constructor(std: BlockStdScope) {
    super(std);
    const initProps: LastProps = LastPropsSchema.parse(
      Object.entries(LastPropsSchema.shape).reduce((value, [key, schema]) => {
        return {
          ...value,
          [key]: schema.parse(undefined),
        };
      }, {})
    );

    this.lastProps$ = computed(() => {
      const editorSetting$ = this.std.getOptional(
        EditorSettingProvider
      )?.setting$;
      const nextProps = mergeWith(
        clonedeep(initProps),
        editorSetting$?.value,
        this.innerProps$.value,
        customizer
      );
      return LastPropsSchema.parse(nextProps);
    });
  }

  private _getStorage<T extends StoragePropsKey>(key: T) {
    return isSessionProp(key) ? sessionStorage : localStorage;
  }

  private _getStorageKey<T extends StoragePropsKey>(key: T) {
    const id = this.std.store.id;
    switch (key) {
      case 'viewport':
        return 'linvo:' + id + ':edgelessViewport';
      case 'presentBlackBackground':
        return 'linvo:presentation:blackBackground';
      case 'presentFillScreen':
        return 'linvo:presentation:fillScreen';
      case 'presentHideToolbar':
        return 'linvo:presentation:hideToolbar';
      case 'presentNoFrameToastShown':
        return 'linvo:presentation:noFrameToastShown';
      case 'templateCache':
        return 'linvo:' + id + ':templateTool';
      case 'remoteColor':
        return 'linvo:remote-color';
      case 'showBidirectional':
        return 'linvo:' + id + ':showBidirectional';
      case 'autoHideEmbedHTMLFullScreenToolbar':
        return 'linvo:embedHTML:autoHideFullScreenToolbar';
      default:
        return key;
    }
  }

  applyLastProps<K extends LastPropsKey>(
    key: K,
    props: Record<string, unknown>
  ) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) {
      throw new LinvoError(
        ErrorCode.DefaultRuntimeError,
        `Invalid key: ${key}`
      );
    }
    const lastProps = this.lastProps$.value[key];
    return mergeWith(clonedeep(lastProps), props, customizer);
  }

  dispose() {
    this._disposables.dispose();
  }

  getStorage<T extends StoragePropsKey>(key: T) {
    try {
      const storage = this._getStorage(key);
      const value = storage.getItem(this._getStorageKey(key));
      if (!value) return null;
      if (isLocalProp(key)) {
        return LocalPropsSchema.shape[key].parse(
          JSON.parse(value)
        ) as StorageProps[T];
      } else if (isSessionProp(key)) {
        return SessionPropsSchema.shape[key].parse(
          JSON.parse(value)
        ) as StorageProps[T];
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  recordLastProps(key: LastPropsKey, props: Partial<LastProps[LastPropsKey]>) {
    const schema = OptionalPropsSchema._def.innerType.shape[key];
    if (!schema) return;

    const overrideProps = schema.parse(props);
    if (Object.keys(overrideProps).length === 0) return;

    const innerProps = this.innerProps$.value;
    const nextProps = mergeWith(
      clonedeep(innerProps),
      { [key]: overrideProps },
      customizer
    );
    this.innerProps$.value = OptionalPropsSchema.parse(nextProps);
  }

  setStorage<T extends StoragePropsKey>(key: T, value: StorageProps[T]) {
    const oldValue = this.getStorage(key);
    this._getStorage(key).setItem(
      this._getStorageKey(key),
      JSON.stringify(value)
    );
    if (oldValue === value) return;
    this.slots.storageUpdated.next({ key, value });
  }

  override unmounted() {
    super.unmounted();
    this.dispose();
  }
}
