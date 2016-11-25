import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'context-menu',
  styles: [`:host { display: block }`],
  template: `<ng-content></ng-content>`,
  host: {
    // TODO: Click events don't propogate to their actual handlers because the
    // view is hiden before they have a chance.
    '(document:click)': 'hide()',
  },
})
export class ContextMenuComponent {
  constructor() { }

  @HostBinding('style.top.px') private y: number;
  @HostBinding('style.left.px') private x: number;
  @HostBinding('style.display') private visible: string = 'none';

  public handleContext(evt: MouseEvent, show: boolean = true) {
    evt.preventDefault();

    this.y = evt.pageY;
    this.x = evt.pageX;

    if (show)
      this.visible = 'initial';
    else
      this.visible = 'none';
  }

  public hide() {
    this.visible = 'none';
  }
}

