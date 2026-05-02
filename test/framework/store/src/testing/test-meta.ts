import type { DocMeta, DocsPropertiesMeta, DocSourceMeta } from '@linvo-core/store';
import * as Y from '@linvo-core/store/compat';
import { createYProxy } from '@linvo-core/store/reactive';
import { Subject } from 'rxjs';

type DocSourceMetaState = {
  doc?: DocMeta;
  properties?: DocsPropertiesMeta;
  name?: string;
  avatar?: string;
};

export class TestMeta implements DocSourceMeta {
  private readonly _handleDocSourceMetaEvents = (
    events: Y.YEvent<Y.AbstractType>[]
  ) => {
    events.forEach(e => {
      const event = e as Y.YMapEvent<unknown>;
      const hasKey = (k: string) =>
        e.target === this._yMap && event.changes.keys.has(k);

      if (hasKey('doc')) {
        this._handleDocMetaEvent();
      }
    });
  };

  private _prevDocId: string | null = null;

  protected readonly _proxy: DocSourceMetaState;

  protected readonly _yMap: Y.Map<DocSourceMetaState[keyof DocSourceMetaState]>;

  readonly doc: Y.Doc;

  docMetaAdded = new Subject<string>();

  docMetaRemoved = new Subject<string>();

  docMetaUpdated = new Subject<void>();

  readonly id: string = 'meta';

  get docMetas() {
    return this._proxy.doc ? [this._proxy.doc] : [];
  }

  get properties(): DocsPropertiesMeta {
    const meta = this._proxy.properties;
    if (!meta) {
      return {
        tags: {
          options: [],
        },
      };
    }
    return meta;
  }

  constructor(doc: Y.Doc) {
    this.doc = doc;
    const map = doc.getMap(this.id) as Y.Map<
      DocSourceMetaState[keyof DocSourceMetaState]
    >;
    this._yMap = map;
    this._proxy = createYProxy(map);
    this._yMap.observeDeep(this._handleDocSourceMetaEvents);
  }

  private _handleDocMetaEvent() {
    const currentDoc = this._proxy.doc;
    const currentId = currentDoc?.id ?? null;

    if (currentId && currentId !== this._prevDocId) {
      this.docMetaAdded.next(currentId);
    }

    if (this._prevDocId && this._prevDocId !== currentId) {
      this.docMetaRemoved.next(this._prevDocId);
    }

    this._prevDocId = currentId;
    this.docMetaUpdated.next();
  }

  addDocMeta(doc: DocMeta) {
    this.doc.transact(() => {
      const existing = this._proxy.doc;
      if (existing && existing.id !== doc.id) {
        throw new Error(
          `single-doc source already initialized with doc id ${existing.id}`
        );
      }
      this._proxy.doc = doc;
    }, this.doc.clientID);
  }

  getDocMeta(id: string) {
    return this._proxy.doc?.id === id ? this._proxy.doc : undefined;
  }

  initialize() {
    if (!this._proxy.properties) {
      this._proxy.properties = {
        tags: {
          options: [],
        },
      };
    }
  }

  removeDocMeta(id: string) {
    if (this._proxy.doc?.id !== id) {
      return;
    }
    this.doc.transact(() => {
      this._proxy.doc = undefined;
    }, this.doc.clientID);
  }

  setDocMeta(id: string, props: Partial<DocMeta>) {
    if (this._proxy.doc?.id !== id) {
      return;
    }

    this.doc.transact(() => {
      const current = this._proxy.doc;
      if (!current) {
        return;
      }
      this._proxy.doc = {
        ...current,
        ...props,
      };
    }, this.doc.clientID);
  }

  setProperties(meta: DocsPropertiesMeta) {
    this._proxy.properties = meta;
    this.docMetaUpdated.next();
  }
}
