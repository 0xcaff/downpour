import { Component } from '@angular/core';

import { DelugeService } from './deluge.service';

@Component({
  selector: 'deluge-app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(public ds: DelugeService) { }
}

