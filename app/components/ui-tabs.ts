import {Component, Directive, Input, QueryList,
        ViewContainerRef, TemplateRef, ContentChildren,
        ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Directive({
  selector: '[ui-pane]',
})
export class UiPane {
  @Input() title: string;

  constructor(public viewContainer: ViewContainerRef, public templateRef: TemplateRef) { }

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
  directives: [NgFor],
  template: `
    <div [class]='firstDivClasses'>
      <ul [class]='listClasses'>
        <li *ngFor="var pane of panes"
            (click)="select(pane)"
            [class.active]="pane.active">
          <a href="javascript: false">{{pane.title}}</a>
        </li>
      </ul>
    </div>
    <div [class]='secondDivClasses'>
      <ng-content></ng-content>
    </div>
    `
})
export class UiTabs {
  @ContentChildren(UiPane) panes: QueryList<UiPane>;
  select(pane: UiPane) {
    this.panes.toArray().forEach((p: UiPane) => p.active = p == pane);
  }

  @Input() listClasses: string;
  @Input() firstDivClasses: string;
  @Input() secondDivClasses: string;
}

