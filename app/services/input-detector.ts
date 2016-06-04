import {Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class InputDetectorService {
  hasMouse: boolean;
  hasMouseChanged: EventEmitter<boolean>;

  hasTouch: boolean;
  hasTouchChanged: EventEmitter<boolean>;

  bind(touch: EventEmitter<boolean>, mouse: EventEmitter<boolean>) {
    this.hasMouseChanged = mouse;
    this.hasMouseChanged.subscribe(mouse => this.hasMouse = mouse);

    this.hasTouchChanged = touch;
    this.hasTouchChanged.subscribe(touch => this.hasTouch = touch);
  }
}
