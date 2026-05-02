import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BlockComponent, GfxBlockComponent } from '@linvo-core/std';
import type {
  NoteBlockModel,
  RootBlockModel,
  SurfaceBlockModel,
  TitleBlockModel,
  TestGfxBlockModel,
} from './test-schema';

@customElement('test-root-block')
export class RootBlockComponent extends BlockComponent<RootBlockModel> {
  override renderBlock() {
    return html`
      <div class="test-root-block">${this.renderChildren(this.model)}</div>
    `;
  }
}

@customElement('test-note-block')
export class NoteBlockComponent extends BlockComponent<NoteBlockModel> {
  override renderBlock() {
    return html`
      <div class="test-note-block">${this.renderChildren(this.model)}</div>
    `;
  }
}

@customElement('test-title-h1-block')
export class TitleH1BlockComponent extends BlockComponent<TitleBlockModel> {
  override renderBlock() {
    return html` <div class="test-title-block h1">${this.model.text}</div> `;
  }
}

@customElement('test-title-h2-block')
export class TitleH2BlockComponent extends BlockComponent<TitleBlockModel> {
  override renderBlock() {
    return html` <div class="test-title-block h2">${this.model.text}</div> `;
  }
}

@customElement('test-surface-block')
export class SurfaceBlockComponent extends BlockComponent<SurfaceBlockModel> {
  override renderBlock() {
    return html`
      <div class="test-surface-block">${this.renderChildren(this.model)}</div>
    `;
  }
}

@customElement('test-gfx-block')
export class TestGfxBlockComponent extends GfxBlockComponent<TestGfxBlockModel> {
  override renderGfxBlock() {
    return html`
      <div class="test-gfx-block">${this.renderChildren(this.model)}</div>
    `;
  }
}
