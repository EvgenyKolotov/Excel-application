import ExcelComponent from '../../core/ExcelComponent';
import TableFactory from './TableFactory';
import { Selection } from '../../shared/TableSelection';
import { resizeHandler } from './table.resize';
import { isCell, matrix, shouldResize, nextSelector } from './table.functions';
import { defaultStyles } from '../../constants';
import TableSelection from './TableSelection';
import * as actions from '../../store/actions';
import { $, Dom } from '../../core/dom';

class Table extends ExcelComponent {
  static className = 'excel__table';
  public $root: Dom;
  private selection: Selection;

  constructor($root: Dom, options: any) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      subscribe: [],
      ...options
    });
    this.$root= $root;
    this.selection = new TableSelection();
  }

  protected prepare(): void {
    console.log('Prepare Table');
  }

  protected storeChanged(): void {
    console.log('StoreChanged Table');
  }

  public init(): void {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on('formula:input', (text: any) => {
      this.selection.current?.text(text);
      this.updateTextInStore(text)
    })

    this.$on('formula:done', () => {
      this.selection.current?.focus();
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value);
      this.$dispatch(actions.applyStyles({
        value,
        ids: this.selection.selectedIds,
      }));
    })
  }

  public toHTML(): string {
    const table = new TableFactory(50, this.store.getState());
    return table.createTable();
  }

  private selectCell($cell: Dom): void {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(<never[]>Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }

  private async resizeTable(event: any): Promise<void> {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    } catch (error) {
      console.warn('Resize error', error.message);
    }
  }

  protected onMousedown(event: any): void {
    if (shouldResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        const $cells = matrix($target, this.selection.current)
            .map((id: any) => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  protected onKeydown(event: any): void {
    const keys = ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];
    if (keys.includes(event.key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current?.id(true);
      const $next = this.$root.find(nextSelector(event.key, id));
      this.selectCell($next);
    }
  }

  protected updateTextInStore(value: any): void {
    this.$dispatch(actions.changeText({
      id: this.selection.current?.id(),
      value,
    }));
  }

  protected onInput(event: any): void {
    this.updateTextInStore($(event.target).text());
  }
}

export default Table;
