import {
  LINVO_EDGELESS_AUTO_CONNECT_WIDGET,
  EdgelessAutoConnectWidget,
} from '.';

export function effects() {
  customElements.define(
    LINVO_EDGELESS_AUTO_CONNECT_WIDGET,
    EdgelessAutoConnectWidget
  );
}
