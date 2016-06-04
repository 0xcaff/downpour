import {Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class InputDetectorService {
  hasMouse: boolean;
  hasMouseChanged: EventEmitter<bool>;

  hasTouch: boolean;
  hasTouchChanged: EventEmitter<bool>;

  bind(touch: EventEmitter<bool>, mouse: EventEmitter<bool>) {
    this.hasMouseChanged = mouse;
    this.hasMouseChanged.subscribe(mouse => this.hasMouse = mouse);

    this.hasTouchChanged = touch;
    this.hasTouchChanged.subscribe(touch => this.hasTouch = touch);
  }
}
