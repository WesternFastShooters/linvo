import {
  BlockModel,
  type DraftModel,
  type Store,
  toDraftModel,
} from '../document';

type SliceData = {
  content: DraftModel[];
  docSourceId: string;
  pageId: string;
};

export class Slice {
  get content() {
    return this.data.content;
  }

  get docId() {
    return this.data.pageId;
  }

  get docSourceId() {
    return this.data.docSourceId;
  }

  constructor(readonly data: SliceData) {}

  static fromModels(doc: Store, models: DraftModel[] | BlockModel[]) {
    const draftModels = models.map(model => {
      if (model instanceof BlockModel) {
        return toDraftModel(model);
      }
      return model;
    });
    return new Slice({
      content: draftModels,
      docSourceId: doc.docSource.id,
      pageId: doc.id,
    });
  }
}
