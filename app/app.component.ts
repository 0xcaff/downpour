import { Component } from '@angular/core';

import { StateService } from './state.service';

@Component({
  selector: 'deluge-app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private state: StateService) { }
}

