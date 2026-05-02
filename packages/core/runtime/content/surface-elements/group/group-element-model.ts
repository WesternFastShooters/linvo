import type { IVec, PointLocation } from '@linvo-core/global/gfx';
import { Bound, linePolygonIntersects } from '@linvo-core/global/gfx';
import type {
  BaseElementProps,
  GfxModel,
  SerializedElement,
} from '@linvo-core/std/gfx';
import {
  canSafeAddToContainer,
  ElementDataMap,
  field,
  GfxGroupLikeElementModel,
  local,
  observe,
} from '@linvo-core/std/gfx';
import { PlainText } from '@linvo-core/store/reactive/text';

type GroupElementProps = BaseElementProps & {
  children: ElementDataMap;
  title: PlainText;
};

export type SerializedGroupElement = SerializedElement & {
  title: string;
  children: Record<string, boolean>;
};

export class GroupElementModel extends GfxGroupLikeElementModel<GroupElementProps> {
  get rotate() {
    return 0;
  }

  set rotate(_: number) {}

  get type() {
    return 'group';
  }

  static propsToY(props: Record<string, unknown>) {
    if (typeof props.title === 'string') {
      props.title = new PlainText(props.title as string);
    }

    if (props.children && !(props.children instanceof ElementDataMap)) {
      const children = new ElementDataMap();

      Object.keys(props.children).forEach(key => {
        children.set(key as string, true);
      });

      props.children = children;
    }

    return props as GroupElementProps;
  }

  override addChild(element: GfxModel) {
    if (!canSafeAddToContainer(this, element)) {
      return;
    }

    this.surface.store.transact(() => {
      this.children.set(element.id, true);
    });
  }

  override containsBound(bound: Bound): boolean {
    return bound.contains(Bound.deserialize(this.xywh));
  }

  override getLineIntersections(
    start: IVec,
    end: IVec
  ): PointLocation[] | null {
    const bound = Bound.deserialize(this.xywh);
    return linePolygonIntersects(start, end, bound.points);
  }

  removeChild(element: GfxModel) {
    if (!this.children) {
      return;
    }
    this.surface.store.transact(() => {
      this.children.delete(element.id);
    });
  }

  override serialize() {
    const result = super.serialize();
    return result as SerializedGroupElement;
  }

  override lock(): void {
    super.lock();
    this.showTitle = false;
  }

  override unlock(): void {
    super.unlock();
    this.showTitle = true;
  }

  @observe(
    // use `GroupElementModel` type in decorator will cause playwright error
    (_, instance: GfxGroupLikeElementModel<GroupElementProps>, transaction) => {
      instance.setChildIds(
        Array.from(instance.children.keys()),
        transaction?.local ?? false
      );
    }
  )
  @field()
  accessor children: ElementDataMap = new ElementDataMap();

  @local()
  accessor showTitle: boolean = true;

  @field()
  accessor title: PlainText = new PlainText();
}
