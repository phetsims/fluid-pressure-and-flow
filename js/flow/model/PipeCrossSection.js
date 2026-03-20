// Copyright 2014-2026, University of Colorado Boulder

/**
 * Model for a vertical cross section of pipe including the horizontal position, the bottom and top position.
 * All units are in meters.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

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

  /**
   * @public
   */
  getX() {
    return this.x;
  }

  /**
   * @public
   */
  getHeight() {
    return this.yTop - this.yBottom;
  }

  /**
   * @public
   */
  getCenterY() {
    return ( this.yTop + this.yBottom ) / 2;
  }
}

export default PipeCrossSection;
