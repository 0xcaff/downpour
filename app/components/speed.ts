import {Input, Output, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'speedinput-view',
  templateUrl: '../../templates/components/speedinput-view.html',
  host: {
    'class': 'form-group',
    'style': 'display: block',
  },
})
export class SpeedInputView {
  @Input() model: string;
  @Output() modelChange: EventEmitter = new EventEmitter();

  @Input() title: string;
}

