import { Dom } from "../../core/Dom";
import { Styles } from "../../shared/State";

class TableSelection {
  static className = 'selected';
  private group: Dom[];
  public current: Dom | null;

  constructor() {
    this.group = [];
    this.current = null;
  }

  public clear(): void {
    this.group.forEach($cell => $cell.removeClass(TableSelection.className));
    this.group = [];
  }

  public select($elem: Dom): void {
    this.clear();
    $elem.focus().addClass(TableSelection.className);
    this.group.push($elem);
    this.current = $elem;
  }

  public selectGroup($group: Dom[] = []): void {
    this.clear();
    this.group = $group;
    this.group.forEach($elem => $elem.addClass(TableSelection.className));
  }

  public applyStyle(style: Styles): void {
    this.group.forEach($elem => $elem.css(<CSSStyleDeclaration>style));
  }

  public get selectedIds(): string[] {
    return this.group.map($elem => <string>$elem.id());
  }
}

export default TableSelection;
