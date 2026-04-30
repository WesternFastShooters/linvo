import { KanbanCard } from './card.js';
import { KanbanCell } from './cell.js';
import { KanbanGroup } from './group.js';
import { KanbanHeader } from './header.js';

export function pcEffects() {
  customElements.define('linvo-data-view-kanban-card', KanbanCard);
  customElements.define('linvo-data-view-kanban-cell', KanbanCell);
  customElements.define('linvo-data-view-kanban-group', KanbanGroup);
  customElements.define('linvo-data-view-kanban-header', KanbanHeader);
}
