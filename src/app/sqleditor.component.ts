import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'sqleditor',
  template: `<ace-editor
    [(text)]="text"
    [mode]="'sql'"
    #editor style="min-height: 400px; max-height:800px;"></ace-editor>`
})
export class SqleditorComponent {
  @ViewChild('editor') editor;
  _text: string = '';

  @Output() textChange = new EventEmitter();

  set text(val) {
    this._text = val;
    this.textChange.emit(this._text);
  }

  @Input()
  get text() {
    return this._text;
  }

  ngAfterViewInit() {
    this.editor.setTheme('github');

    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true
    });

    this.editor.getEditor().commands.addCommand({
      name: 'showOtherCompletions',
      bindKey: 'Ctrl-.',
      exec: function (editor) {

      }
    });
  }
}
