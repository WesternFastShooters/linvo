import { CheckboxCell } from './checkbox/cell-renderer.js';
import { DateCell } from './date/cell-renderer.js';
import { ImageCell } from './image/cell-renderer.js';
import { MultiSelectCell } from './multi-select/cell-renderer.js';
import { NumberCell } from './number/cell-renderer.js';
import { ProgressCell } from './progress/cell-renderer.js';
import { SelectCell } from './select/cell-renderer.js';
import { TextCell } from './text/cell-renderer.js';

export function propertyPresetsEffects() {
  customElements.define('linvo-database-checkbox-cell', CheckboxCell);
  customElements.define('linvo-database-date-cell', DateCell);
  customElements.define('linvo-database-image-cell', ImageCell);
  customElements.define('linvo-database-multi-select-cell', MultiSelectCell);
  customElements.define('linvo-database-number-cell', NumberCell);
  customElements.define('linvo-database-progress-cell', ProgressCell);
  customElements.define('linvo-database-select-cell', SelectCell);
  customElements.define('linvo-database-text-cell', TextCell);
}
