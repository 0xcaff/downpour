import {Input, Output, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'textinput-view',
  templateUrl: '../../templates/components/textinput-view.html',
  host: {
    'class': 'form-group',
    'style': 'display: block',
  },
})
export class TextInputView {
  @Input() model: string;
  @Output() modelChange: EventEmitter<string> = new EventEmitter();

  @Input() checkbox: boolean;
  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter();

  @Input() title: string;
  @Input() addon: boolean;
  @Input() placeholder: string;
  @Input() type: string;

  private _slug: string;
  get slug(): string {
    if (this._slug) return this._slug;
    if (!this.title) return '';
    this._slug = this.title.replace(/ /g, '_');
    return this._slug;
  }
}

