class TableSelection {
  static className = 'selected';

  constructor() {
    this.group = [];
    this.current = null;
  }

  clear() {
    this.group.forEach($cell => $cell.removeClass(TableSelection.className));
    this.group = [];
  }

  select($elem) {
    this.clear();
    $elem.focus().addClass(TableSelection.className);
    this.group.push($elem);
    this.current = $elem;
  }

  selectGroup($group = []) {
    this.clear();
    this.group = $group;
    this.group.forEach($elem => $elem.addClass(TableSelection.className));
  }

  applyStyle(style) {
    this.group.forEach($elem => $elem.css(style));
  }

  get selectedIds() {
    return this.group.map($elem => $elem.id());
  }
}

export default TableSelection;
