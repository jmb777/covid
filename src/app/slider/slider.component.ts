import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

/**
 * @title Configurable slider
 */
@Component({
  selector: 'slider-component',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css'],
})
export class SliderComponent implements OnInit, OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    this.max = this.maxY;
  }
ngOnInit(): void {
this.value = this.max;;
}
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 0;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = true;
  tickInterval = 1;
  @Input() maxY;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  onValueChange(e) {
    console.log(e);
  }
}


/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */