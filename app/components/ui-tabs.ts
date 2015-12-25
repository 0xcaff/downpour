import {Component, Directive, Input, QueryList,
        ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';

@Directive({
  selector: '[ui-pane]'
})
export class UiPane {
  @Input() title: string;
  viewContainer: ViewContainerRef;
  templateRef: TemplateRef;

  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef) {
    this.viewContainer = viewContainer;
    this.templateRef = templateRef;
  }

  private _active:boolean = false;
  @Input() set active(active: boolean) {
    if (active == this._active) {
      return
    } else if (active) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.remove(0);
    }
    this._active = active;
  }
  get active(): boolean {
    return this._active;
  }
}

@Component({
  selector: 'ui-tabs',
  template: `
    <ul class="nav nav-tabs nav-justified">
      <li *ngFor="var pane of panes"
          (click)="select(pane)"
          [class.active]="pane.active">
        <a href="javascript: false">{{pane.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
    `
})
export class UiTabs {
  @ContentChildren(UiPane) panes: QueryList<UiPane>;
  select(pane: UiPane) {
    this.panes.toArray().forEach((p: UiPane) => p.active = p == pane);
  }
}
