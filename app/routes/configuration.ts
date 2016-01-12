import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';
import {Configuration} from '../models/configuration';

import {UiTabs, UiPane} from '../components/ui-tabs';
import {CheckboxView} from '../components/checkbox';
import {TextInputView} from '../components/text';
import {SpeedInputView} from '../components/speed';
import {NumberInputView} from '../components/number';
import {PortView} from '../components/port';

@Component({
  templateUrl: 'templates/configuration.html',
  directives: [UiTabs, UiPane, CheckboxView, TextInputView, SpeedInputView,
    NumberInputView, PortView],
})
export class ConfigurationComponent extends AuthenticatedRoute {
  config: Configuration;

  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }

  ngOnInit() {
    super.ngOnInit()
      .then(ds => ds.getConfiguration())
      .then(d => this.config = d);
  }

  save() {
    this.ds.setConfig(this.config)
      .then(_ => this.r.navigate(['Torrents']));
  }
}
