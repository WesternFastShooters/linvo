import { UIEventState } from '../base';

type ClipboardEventStateOptions = {
  event: ClipboardEvent;
};

export class ClipboardEventState extends UIEventState {
  raw: ClipboardEvent;

  override type = 'clipboardState';

  constructor({ event }: ClipboardEventStateOptions) {
    super(event);

    this.raw = event;
  }
}

declare global {
  interface LinvoUIEventState {
    clipboardState: ClipboardEventState;
  }
}
