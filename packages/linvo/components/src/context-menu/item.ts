import { SignalWatcher, WithDisposable } from '@linvo/global/lit';
import { ShadowlessElement } from '@linvo/std';
import { property } from 'lit/decorators.js';

import type { Menu } from './menu.js';

export abstract class MenuItem extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  @property({ attribute: false })
  accessor menu!: Menu;
}
