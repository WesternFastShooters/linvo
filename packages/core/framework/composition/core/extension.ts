import type { Container } from '../di';

export interface ExtensionType {
  setup(di: Container): void;
}
