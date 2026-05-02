import { SignalWatcher, WithDisposable } from '@linvo-core/global/lit';
import { ShadowlessElement } from '@linvo-core/std';
import { property } from 'lit/decorators.js';

import type { Menu } from './menu';

export abstract class MenuItem extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  @property({ attribute: false })
  accessor menu!: Menu;
}
