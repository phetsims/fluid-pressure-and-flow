// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for a vertical cross section of pipe including the horizontal position, the bottom and top position.
 * All units are in meters.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class PipeCrossSection {

  /**
   * @param {number} x - represents the x value of the cross section
   * @param {number} yBottom - represents the bottom most point of the cross section
   * @param {number} yTop - represents the top most point of the cross section
   */
  constructor( x, yBottom, yTop ) {
    this.x = x;
    this.yBottom = yBottom;
    this.yTop = yTop;
  }

  getX() {
    return this.x;
  }

  getHeight() {
    return this.yTop - this.yBottom;
  }

  getCenterY() {
    return ( this.yTop + this.yBottom ) / 2;
  }
}

fluidPressureAndFlow.register( 'PipeCrossSection', PipeCrossSection );
export default PipeCrossSection;