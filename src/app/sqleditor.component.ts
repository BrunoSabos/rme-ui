import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DatabaseService} from './database.service';

@Component({
  selector: 'sqleditor',
  template: `
    <ace-editor
      [(text)]="text"
      [mode]="'sql'"
      #editor class="ace-editor"></ace-editor>`
})
export class SqleditorComponent {
  constructor(private databaseService: DatabaseService) {
  }

  @ViewChild('editor') editor;
  _text: string = '';

  @Output() textChange = new EventEmitter();

  set text(val) {
    console.log('setText');
    this._text = val;
    this.textChange.emit(this._text);
  }

  @Input()
  get text() {
    // todo infinite loop
    // console.log('getText');
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
