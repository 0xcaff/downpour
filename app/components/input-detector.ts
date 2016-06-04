import {Component, Output, Renderer, EventEmitter} from 'angular2/core';
import {InputDetectorService} from '../services/input-detector';

@Component({
  selector: 'input-detector',
  template: '<div style="display:none"></div>',
})
export class InputDetectorComponent {
  @Output() hasTouch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hasMouse: EventEmitter<boolean> = new EventEmitter<boolean>();
  mouseMoveCount: number = 0;
  mouseDownCount: number = 0;

  constructor(private renderer: Renderer, private ids: InputDetectorService) {
    ids.bind(this.hasTouch, this.hasMouse);

    var cancelMouseMove = renderer.listenGlobal('document', 'mousemove', () => {
      this.mouseMoveCount++;
      this.updateMouseCapability();
    });

    var cancelMouseDown = renderer.listenGlobal('document', 'mousedown', () => {
      this.mouseDownCount++;
      this.updateMouseCapability();
    });

    // TODO: Do this by checking for touch properties
    var cancelTouch = renderer.listenGlobal('document', 'touchstart', () => {
      // Non-touch devices typically don't emit touch events so this should be
      // accurate.

      this.hasTouch.emit(true);
      cancelTouch();
    });
  }

  updateMouseCapability() {
    if (this.mouseDownCount > 0 && this.mouseMoveCount == this.mouseDownCount) {
      // The device is emulating mouse movements. It is probably a pen-input,
      // iPad or something else with a touch input.

      this.hasMouse.emit(false);
      this.hasTouch.emit(true);
    } else {
      // This device probably has a mouse because its emitting natural mouse
      // events. Or it could be a really good touchscreen which detects hand
      // movements when not touching the screen.

      this.hasMouse.emit(true);
    }
  }
}

