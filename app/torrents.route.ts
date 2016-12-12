import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { DelugeService, poll } from './deluge.service';
import { InputDetectorService } from './input-detector.service';
import { StateService, TorrentsComponentProperties, BasicProperties } from './state.service';

import { ContextMenuComponent } from './context-menu.component';
import { Torrent } from './models/torrent';

@Component({
  templateUrl: './torrents.route.html',
  styleUrls: ['./torrents.route.css', './dropdown-submenu.css'],
})
export class TorrentsComponent {
  @ViewChild(ContextMenuComponent) contextMenu: ContextMenuComponent;

  // True before data has been populated.
  loading: boolean = true;

  filterChanged: Subject<string> = new Subject();

  constructor(
    public r: Router, public ids: InputDetectorService, private state: StateService,
    public ds: DelugeService
  ) {
    this.filterChanged
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((filter: string) => this.state.filter = filter);
  }

  filterChange(text: string) {
    this.filterChanged.next(text);
  }

  ngOnInit() {
    this.state.stateProperties = TorrentsComponentProperties;
    this.state.pollUpdates
      .filter(state => state.params === TorrentsComponentProperties)
      .first()
      .subscribe(() => this.loading = false);
  }

  ngOnDestroy() {
    this.state.stateProperties = BasicProperties;
  }

  // Handle clicks at the top of columns.
  // TODO: Make this table a component.
  sort(column: string, evt: Event) {
    if (column == this.state.sortBy && this.state.descending !== undefined) {
      this.state.descending = !this.state.descending;
    } else {
      if (column == '')
        this.state.descending = undefined;
      else
        this.state.descending = true;

      this.state.sortBy = column;
    }
  }

  // TODO: O(n)
  getSelected() {
    return this.state.state.torrents.values.filter((v, i) => v.checked).map(v => v.hash);
  }

  // TODO: Selection Experience Sucks
  // TODO: O(n)
  unselect() {
    this.state.state.torrents.values.forEach(v => v.checked = false);
  }

  contextmenu(t: Torrent, evt: MouseEvent) {
    if (evt.altKey || !this.ids.hasMouse) {
      return;
    }

    if (!t.checked) {
      this.unselect();
      t.checked = true;
    }

    this.contextMenu.handleContext(evt);
  }
}

