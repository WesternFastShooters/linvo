import { AdapterPanel, LINVO_ADAPTER_PANEL } from './adapter-panel';
import {
  AdapterPanelBody,
  LINVO_ADAPTER_PANEL_BODY,
} from './body/adapter-panel-body';
import { AdapterMenu, LINVO_ADAPTER_MENU } from './header/adapter-menu';
import {
  AdapterPanelHeader,
  LINVO_ADAPTER_PANEL_HEADER,
} from './header/adapter-panel-header';

export function effects() {
  customElements.define(LINVO_ADAPTER_PANEL, AdapterPanel);
  customElements.define(LINVO_ADAPTER_MENU, AdapterMenu);
  customElements.define(LINVO_ADAPTER_PANEL_HEADER, AdapterPanelHeader);
  customElements.define(LINVO_ADAPTER_PANEL_BODY, AdapterPanelBody);
}
